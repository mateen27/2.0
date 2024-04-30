import React from "react";
import AppNavigator from "./src/navigation/stack/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import ChatProvider from "./src/context/ChatProvider";
import Header from "./src/components/Header";

const App: React.FC<{}> = () => {
  return (
    // <NavigationContainer>
    //   <ChatProvider>
    //     <AppNavigator />
    //   </ChatProvider>
    // </NavigationContainer>
    <>
      <Header/>
    </>
  );
};

export default App;
