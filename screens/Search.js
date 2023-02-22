import React, { useState } from 'react';
import { Appbar, Button, Card, TextInput, Title } from 'react-native-paper';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';
import { CITY_API_KEY } from '../config.json';

const Search = ({navigation}) => {
  const [city, setCity] = useState()
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(false);

  const getCities = (key) => {
    fetch(`https://api.api-ninjas.com/v1/city?name=${key}&limit=30`, { headers: { "X-Api-Key": CITY_API_KEY } }).then((res) => res.json())
    .then((data) => {
      setCities(data);
    })
  }
  return (
    <View style={{ flex: 1 }}>
        <Header name="Search Screen" />
        <TextInput 
          placeholder='City Name'
          theme={{ colors: {primary: "#00aaff"} }}
          value={city}
          onChangeText={(value) => {
            setCity(value);
            getCities(value);

          }}
        />

        <Button disabled={!selectedCity} icon="content-save" mode="contained" onPress={() => { AsyncStorage.setItem("city", city); navigation.navigate("Home", {city: city}) } } theme={{ colors: {primary: "#00aaff"} }} style={{ margin: 20 }}>
          <Text>Save Changes</Text>
        </Button>
        
        <FlatList 
          data={cities}
          keyExtractor={city => city.name}
          renderItem={({item}) => {
            return(
              <Card
                key={Math.random()}
                style={{ margin: 2, padding: 12 }}
                onPress={() => { console.log("clicked"); setCity(item.name.toString()); setSelectedCity(true) }}
              >
                <Text>{item.name}</Text>
              </Card>
            )
          }}
        />
    </View>
  );
};

export default Search;