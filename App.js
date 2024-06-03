import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView } from 'react-native';
import { bancoExterno } from './firebaseConnection';
import { useFonts } from 'expo-font';
import { useState, useEffect, useCallback } from 'react';
import { setDoc, doc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';  // Corrected import for getDocs
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [nomeInput, setNomeInput] = useState('');
  const [tipoInput, setTipoInput] = useState('');
  const [nextCode, setNextCode] = useState(1);

  // fonte
  const [fontsLoaded, fontError] = useFonts({
    'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Black': require('./assets/fonts/Poppins-Black.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    getNextCode();
  }, []);

  async function getNextCode() {
    try {
      const q = query(collection(bancoExterno, "Alimentos"), orderBy("code", "desc"), limit(1));
      const querySnapshot = await getDocs(q);  // Corrected function getDocs instead of getDoc
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setNextCode(docData.code + 1);
      } else {
        setNextCode(1);
      }
    } catch (error) {
      console.error("Erro ao obter próximo código: ", error);
    }
  }

  async function addBancoExterno() {
    try {
      await setDoc(doc(bancoExterno, "Alimentos", nextCode.toString()), {
        nome: nomeInput,
        tipo: tipoInput,
        code: nextCode
      });
      console.log("Documento adicionado com sucesso!");
      // Incrementar o próximo código
      setNextCode(nextCode + 1);
      // Limpar os campos após adicionar
      setNomeInput('');
      setTipoInput('');
    } catch (error) {
      console.error("Erro ao adicionar documento: ", error);
    }
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 10 }}>
        <View style={styles.container} onLayout={onLayoutRootView}>

          <View style={styles.boxHeader}>
            <Image
              source={require('./assets/logo.png')}
              style={styles.logo}
            />

            <Text style={styles.tituloLogo}>
              Nutri
              <Text style={{ color: '#F9A700', fontFamily: 'Poppins-Black' }}>Food</Text>
            </Text>
          </View>

          <View style={styles.boxImg}>
            <Image source={require('./assets/chef.png')} style={styles.img} />
          </View>

          <View style={styles.boxMain}>
            <Text style={styles.textoInformativo}>
              <Text style={{ fontFamily: 'Poppins-Black' }}>Adicione </Text>
              o nome e o tipo de alimento que deseja e confere em no
              <Text style={{ fontFamily: 'Poppins-Black' }}> outro aplicativo</Text>
            </Text>

            <View style={styles.containerInput}>
              <Image source={require('./assets/vetorNome.png')} style={styles.icon} />

              <TextInput
                style={styles.input}
                placeholder="Nome do alimento"
                onChangeText={(text) => setNomeInput(text)}
                value={nomeInput}
              />
            </View>

            <View style={styles.containerInput}>
              <Image source={require('./assets/vetorTipo.png')} style={styles.icon} />

              <TextInput
                style={styles.input}
                placeholder="Tipo do alimento"
                onChangeText={(text) => setTipoInput(text)}
                value={tipoInput}
              />
            </View>

            <View style={styles.boxBotao}>
              <TouchableOpacity style={styles.botaoAdd} onPress={addBancoExterno}>
                <Text style={styles.botaoTexto}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <StatusBar style="auto" />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 50
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  logo: {
    width: 35,
    height: 40,
    marginRight: 5,
  },
  tituloLogo: {
    fontFamily: 'Poppins',
    fontSize: 25,
  },
  boxImg: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  img: {
    width: 300,
    height: 300,
  },
  textoInformativo: {
    fontFamily: 'Poppins',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 2,
    padding: 4,
    borderRadius: 10,
    marginBottom: 30,
  },
  icon: {
    width: 35,
    height: 35,
  },
  input: {
    height: 40,
    width: '80%',
    paddingHorizontal: 10,
    fontSize: 18,
    fontFamily: 'Poppins-Light',
    alignItems: 'center'
  },
  boxBotao: {
    alignItems: 'center'
  },
  botaoAdd: {
    backgroundColor: '#F9A700',
    width: '60%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  botaoTexto: {
    fontFamily: 'Poppins',
    fontSize: 20,
    color: '#FFFFFF'
  }
});
