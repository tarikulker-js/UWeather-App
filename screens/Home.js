import React, { useEffect, useState } from 'react';
import { Card, Title } from 'react-native-paper';
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, PermissionsAndroid } from 'react-native';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { OPEN_WEATHER_MAP_KEY } from '../config.json';

const Home = ({ navigation, route }) => {
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    name: "Please wait... Loading...",
    temp: "loading...",
    humidity: "loading",
    desc: "loading",
    icon: "loading"
  })

  const getWeather = () => {
    setInfo({
      name: "Please wait... Loading...",
      temp: "loading...",
      humidity: "loading",
      desc: "loading",
      icon: "loading"
    })

    AsyncStorage.getItem("city").then(async (getedCity) => {
      if (!getedCity) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'My App needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can access the location');

          Geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            Geocoder.init('AIzaSyDPQLEfTy_Pr-JfH4myNpxG21iPomgloS8');

            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`).then((res) => res.json())
              .then(response => {
                console.log(response)
                const address = response.address;
                const locationCity = address.city || address.province || address.town || address.village || address.hamlet;

                getedCity = locationCity;

                setCity(getedCity);
                fetch(`https://api.openweathermap.org/data/2.5/weather?q=${getedCity}&appid=${OPEN_WEATHER_MAP_KEY}&units=metric`).then((res) => res.json())
                  .then((data) => {
                    setLoading(false)
                    setInfo({
                      name: data.name,
                      temp: parseFloat(data.main.temp),
                      humidity: data.main.humidity,
                      desc: data.weather[0].description,
                      icon: data.weather[0].icon
                    })
                  })
              }).catch(error => console.warn(error));

          }, error => console.log(error), { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });

        } else {
          console.log('Location permission denied. Please select a city.');
          alert('Location permission denied');
        }

      } else {
        setCity(getedCity);
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${getedCity}&appid=${OPEN_WEATHER_MAP_KEY}&units=metric`).then((res) => res.json())
          .then((data) => {
            setLoading(false)
            setInfo({
              name: data.name,
              temp: parseFloat(data.main.temp),
              humidity: data.main.humidity,
              desc: data.weather[0].description,
              icon: data.weather[0].icon
            })
          })
      }
    })

  }

  useEffect(() => {
    getWeather()

  }, [])

  useEffect(() => {
    if (route?.params?.city) {
      getWeather();
      delete route.params.city;
    }
  })

  return (
    <View style={{ flex: 1 }} >
      <Header name={`${city} Weather`} />

      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getWeather()} />}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 25 }}>
            <Title style={{ color: "#00aaff", marginTop: 30, fontSize: 30 }}>
              {info.name}
            </Title>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Image source={{ uri: "https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" }} style={{ width: 20, height: 20, marginTop: 20, marginLeft: 5 }} />
            </TouchableOpacity>

          </View>
          <Image
            style={{
              width: 120,
              height: 120
            }}
            source={{ uri: `https://openweathermap.org/img/w/${info.icon}.png` }}
          />
          <Text style={{ color: "white" }}>{info.desc}</Text>
        </View>

        <Card style={{
          margin: 5,
          padding: 12,
        }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{ color: "#00aaff" }}>{Math.ceil(info.temp)} °C</Title>

          </View>
        </Card>

        <Card style={{
          margin: 5,
          padding: 12,
          display: "flex",

        }}>
          <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/219/219816.png" }} style={{ width: 20, height: 20 }} />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{ color: "#00aaff" }}>Humidity: {Math.ceil(info.humidity)}%</Title>

          </View>
        </Card>

      </ScrollView>

    </View>
  );
};

export default Home;