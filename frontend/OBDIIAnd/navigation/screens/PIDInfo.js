import TestTable from "../../components/TestTable";
import { View, Text, TextInput } from "react-native";
import { useState } from "react";
import Buttons from "../../components/Buttons";
import { useUser } from "../../context/UserContext";

//Placeholder for future Custom nonstandard PID input and testing by user. 
export default function PIDInfo(){
const [pid, setPID] = useState("");
const tempPID = "";
const {isConnected} = useUser();


    function tempHandler(pid){
        setPID(pid)
    }

    return(
        <View>
            <Text>Current Vehicle</Text>
            <Text>SetPid</Text>
            <TextInput placeholder="Enter PID Here" onChangeText={(pid) => tempHandler(pid)} />
            <Buttons title={"Send"} onPress={() => console.log("Confirm " + pid)}/>
            <Text>PID IS {pid}</Text>
            <Text>RETURN </Text>
            <TestTable />

        </View>
    )
}