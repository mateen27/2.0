import React from "react";
import AppNavigator from "./src/navigation/stack/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import store from "./src/redux/store/store";
import { Provider } from "react-redux";

const App: React.FC<{}> = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </NavigationContainer>

  );
};

export default App;
