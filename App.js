import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventStorageProvider } from './contexts/EventStorageContext';

import { Text } from 'react-native-svg';

//PAGES
import Home from './screens/Home';
import EventDetailPage from './screens/EventDetailPage';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import * as Linking from 'expo-linking';

const client = new ApolloClient({
  uri: 'https://us-east-1-shared-usea1-02.cdn.hygraph.com/content/clhvznxbz10sb01tbempl16ux/master',
  cache: new InMemoryCache({
    typePolicies: {
      Event: {
        fields: {
          beschrijving: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

const linking = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Event: 'event/:eventID',
    },
  },
};

const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <ApolloProvider client={client}>
      <EventStorageProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />

            <Stack.Screen name="Event" component={EventDetailPage} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </EventStorageProvider>
    </ApolloProvider>
  );
}