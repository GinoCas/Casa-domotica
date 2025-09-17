import React, { useEffect, useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MultiComboGroupProps, Option } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

const MultiComboGroup: React.FC<MultiComboGroupProps> = ({
  options,
  onOptionChange,
  onClose,
  value = [],
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(value);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const previousValue = useRef<Option[]>(value);

  // Solo sincronizar si la prop value realmente cambió
  useEffect(() => {
    const hasChanged =
      value.length !== previousValue.current.length ||
      !value.every((v) =>
        previousValue.current.some((s) => s.deviceId === v.deviceId),
      );

    if (hasChanged) {
      setSelectedOptions(value);
      previousValue.current = value;
    }
  }, [value]);

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
    onOptionChange(newSelectedOptions);
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
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={options}
          keyExtractor={(group) => group.label}
          renderItem={({ item: group }) => (
            <View style={styles.groupContainer}>
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
                            isOptionSelected(option) &&
                              styles.selectedOptionText,
                          ]}
                        >
                          {option.label}
                        </Text>
                        <Text style={styles.optionType}>
                          {option.deviceType}
                        </Text>
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
          )}
        />
        <View>
          {selectedOptions.length > 0 && (
            <View style={styles.selectedSummary}>
              <Text style={styles.summaryText}>
                Seleccionados: {selectedOptions.length} dispositivos
              </Text>
            </View>
          )}
          <Button
            title="Aceptar"
            onPress={() => {
              console.log(value);
              onClose();
            }}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 500,
    padding: 16,
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
    width: 200,
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
