import useAutomationStore from "@/stores/useAutomationStore";
import { Automation } from "../core/entities/Automation";
import { automationService } from "./AutomationService";
import { AutomationDto } from "../application/dtos/AutomationDto";

export async function loadAutomations() {
  const { handleLoadAutomations } = useAutomationStore.getState();
  const { changeLoadingAutomation } = useAutomationStore.getState() as any;
  try {
    changeLoadingAutomation?.(true);
    const result = await automationService.getAllAutomations();
    if (!result.isSuccess) {
      console.log("Error al cargar automatizaciones", result.errors);
      return;
    }
    handleLoadAutomations(result.data);
  } finally {
    changeLoadingAutomation?.(false);
  }
}

export async function deleteAutomation(id: number) {
  const { automations, handleLoadAutomations, setLastModified } =
    useAutomationStore.getState();
  const { changeLoadingAutomation } = useAutomationStore.getState() as any;
  try {
    changeLoadingAutomation?.(true);
    const result = await automationService.deleteAutomation(id);
    if (!result.isSuccess) {
      console.log("Error al eliminar automatización", result.errors);
      return;
    }
    const filtered = automations.filter((a) => a.id !== id);
    handleLoadAutomations(filtered);
    setLastModified(new Date());
  } finally {
    changeLoadingAutomation?.(false);
  }
}

export async function controlAutomation(updatedAuto: Automation) {
  const { automations, handleLoadAutomations, setLastModified } =
    useAutomationStore.getState();
  const { changeLoadingAutomation } = useAutomationStore.getState() as any;
  try {
    changeLoadingAutomation?.(true);
    const result = await automationService.controlAutomation(updatedAuto);
    if (!result.isSuccess) {
      console.log("Error al controlar automatización", result.errors);
      return;
    }
    const updatedList = automations.map((auto) =>
      auto.id === updatedAuto.id ? result.data : auto,
    );
    handleLoadAutomations(updatedList);
    setLastModified(new Date());
  } finally {
    changeLoadingAutomation?.(false);
  }
}

export async function updateAutomation(
  id: number,
  name: string,
  description: string,
) {
  const { automations, handleLoadAutomations, setLastModified } =
    useAutomationStore.getState();
  const { changeLoadingAutomation } = useAutomationStore.getState() as any;
  try {
    changeLoadingAutomation?.(true);
    const dto = new AutomationDto(name, description);
    const result = await automationService.updateAutomation(id, dto);
    if (!result.isSuccess) {
      console.log("Error al actualizar automatización", result.errors);
      return;
    }
    const updatedList = automations.map((auto) =>
      auto.id === id ? result.data : auto,
    );
    handleLoadAutomations(updatedList);
    setLastModified(new Date());
  } finally {
    changeLoadingAutomation?.(false);
  }
}

export function mergeAutomations(changedAutomations: Automation[]) {
  const { automations, handleLoadAutomations } = useAutomationStore.getState();
  const merged = new Map<number, Automation>();
  for (const a of automations) merged.set(a.id, a);
  for (const a of changedAutomations) merged.set(a.id, a);
  handleLoadAutomations(Array.from(merged.values()));
}

export async function createAutomation(): Promise<Automation | null> {
  const { automations, setLastModified } = useAutomationStore.getState();
  console.log("Creando automatizacion...");
  const baseInit = "00:00";
  const baseEnd = "00:01";
  const newAuto = new Automation(
    -1,
    "Nueva Automatización",
    "",
    baseInit,
    baseEnd,
    [],
    false,
    0,
  );

  const baseline = new Date();
  setLastModified(baseline);
  const control = await automationService.controlAutomation(newAuto);
  if (!control.isSuccess) {
    console.log(
      "No se pudo enviar la automatización al Arduino",
      control.errors,
    );
    return null;
  }

  const toIso8601Seconds = (date: Date) =>
    date.toISOString().replace(/\.\d{3}Z$/, "Z");

  const timeoutMs = 12000; // 12s
  const pollIntervalMs = 1500;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const result = await automationService.getAutomationsModifiedAfter(
      toIso8601Seconds(baseline),
    );
    if (result.isSuccess && result.data.length > 0) {
      const created = result.data.find(
        (remote) => !automations.some((local) => local.id === remote.id),
      );
      if (created) {
        console.log("Automatización creada");
        mergeAutomations([created]);
        setLastModified(new Date());
        return created;
      }
    }
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }
  console.warn(`Timeout de esperando confirmación de la automatización.`);
  return null;
}
