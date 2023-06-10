import react from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventStorageProvider } from './contexts/EventStorageContext';

//PAGES
import Home from './screens/Home';
import EventDetailPage from './screens/EventDetailPage';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api-us-east-1-shared-usea1-02.hygraph.com/v2/clhvznxbz10sb01tbempl16ux/master',
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

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <ApolloProvider client={client}>
      <EventStorageProvider>
        <NavigationContainer>
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