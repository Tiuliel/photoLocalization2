import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

export default function App() {
  const [temPermissaoCamera, setTemPermissaoCamera] = useState(null);
  const [camera, setCamera] = useState(null);
  const [uriFoto, setUriFoto] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [titulo, setTitulo] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setTemPermissaoCamera(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }

      let localizacao = await Location.getCurrentPositionAsync({});
      setLocalizacao(localizacao);
    })();
  }, []);

  const tirarFoto = async () => {
    if (camera) {
      const dados = await camera.takePictureAsync();
      setUriFoto(dados.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={ref => setCamera(ref)}
      />
      <Button title="Tirar Foto" onPress={tirarFoto} />
      {uriFoto && <Image source={{ uri: uriFoto }} style={styles.previewFoto} />}
      <TextInput
        style={styles.input}
        placeholder="Digite o título"
        onChangeText={text => setTitulo(text)}
        value={titulo}
      />
      <Text>Latitude: {localizacao?.coords.latitude}</Text>
      <Text>Longitude: {localizacao?.coords.longitude}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  camera: {
    width: '100%',
    height: '50%',
  },
  previewFoto: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});
