import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import Buttons from '../../components/Buttons';
import GarageList from '../../components/GarageList';

export default function VehicleInfo({ data }) {
  const results = data.Results || [];

  const validResults = results.filter(
    (item) => item.Value && item.Value.trim() !== ''
  );

  function garageHandler(){

  }
  return (
  <>
    <ScrollView style={styles.container}>
      {validResults.map((item) => (
        <View key={item.Variable} style={styles.row}>
          <Text style={styles.variableText}>{item.Variable}:</Text>
          <Text style={styles.valueText}>{item.Value}</Text>
        </View>
      ))}
    </ScrollView>
    <Buttons title = "Add to Garage" onPress={"Do"} />
  </>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  variableText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  valueText: {
    fontSize: 16,
    color: '#555',
    flex: 1, // Allows text to wrap
    textAlign: 'right', // Aligns values nicely
  },
});