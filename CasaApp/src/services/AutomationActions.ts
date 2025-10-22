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