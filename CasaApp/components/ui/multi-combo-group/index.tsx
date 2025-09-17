import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MultiComboGroupProps, Option } from "./types";

const MultiComboGroup: React.FC<MultiComboGroupProps> = ({
  options,
  onOptionPress,
  value = [],
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(value);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Sincronizar el estado interno con la prop value cuando cambie
  /*   useEffect(() => {
    console.log("MultiComboGroup useEffect value", value);
    setSelectedOptions(value);
  }, [value]);
 */
  const toggleOption = (option: Option) => {
    const isSelected = selectedOptions.some(
      (selected) => selected.deviceId === option.deviceId,
    );

    let newSelectedOptions: Option[];
    if (isSelected) {
      newSelectedOptions = selectedOptions.filter(
        (selected) => selected.deviceId !== option.deviceId,
      );
    } else {
      newSelectedOptions = [...selectedOptions, option];
    }

    setSelectedOptions(newSelectedOptions);
    onOptionPress(option);
  };

  const toggleGroup = (groupLabel: string) => {
    if (expandedGroups.includes(groupLabel)) {
      setExpandedGroups(expandedGroups.filter((label) => label !== groupLabel));
    } else {
      setExpandedGroups([...expandedGroups, groupLabel]);
    }
  };

  const isOptionSelected = (option: Option) => {
    return selectedOptions.some(
      (selected) => selected.deviceId === option.deviceId,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccionar Dispositivos</Text>

      {options.map((group) => (
        <View key={group.label} style={styles.groupContainer}>
          <TouchableOpacity
            style={styles.groupHeader}
            onPress={() => toggleGroup(group.label)}
          >
            <Text style={styles.groupLabel}>{group.label}</Text>
            <Text style={styles.expandIcon}>
              {expandedGroups.includes(group.label) ? "−" : "+"}
            </Text>
          </TouchableOpacity>

          {expandedGroups.includes(group.label) && (
            <View style={styles.optionsContainer}>
              {group.options.map((option) => (
                <TouchableOpacity
                  key={option.deviceId}
                  style={[
                    styles.optionItem,
                    isOptionSelected(option) && styles.selectedOption,
                  ]}
                  onPress={() => toggleOption(option)}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isOptionSelected(option) && styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.optionType}>{option.deviceType}</Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      isOptionSelected(option) && styles.checkedBox,
                    ]}
                  >
                    {isOptionSelected(option) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

      {selectedOptions.length > 0 && (
        <View style={styles.selectedSummary}>
          <Text style={styles.summaryText}>
            Seleccionados: {selectedOptions.length} dispositivos
          </Text>
        </View>
      )}
      <Button title="Aceptar" onPress={() => console.log(selectedOptions)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  groupContainer: {
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
    overflow: "hidden",
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e9ecef",
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
  },
  expandIcon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6c757d",
  },
  optionsContainer: {
    backgroundColor: "#fff",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  selectedOption: {
    backgroundColor: "#e3f2fd",
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  selectedOptionText: {
    color: "#1976d2",
    fontWeight: "500",
  },
  optionType: {
    fontSize: 12,
    color: "#6c757d",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#dee2e6",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedSummary: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
  },
  summaryText: {
    fontSize: 14,
    color: "#495057",
    textAlign: "center",
  },
});

export default MultiComboGroup;
