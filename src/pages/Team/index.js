import { View, Text, ScrollView } from "react-native";

import { TeamStyles } from "./styles";
import TeamMember from "./components/TeamMember"
import EditTeamMember from "./components/EditTeamMember"
import SearchBar from "../../components/SearchBar"

export default function Team() {
  return (
    <View style={TeamStyles.container}>
      <SearchBar />
      <ScrollView style={TeamStyles.scroll}
            showsVerticalScrollIndicator={false}>
        <TeamMember/>
          <EditTeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
        <TeamMember/>
      </ScrollView>
    </View>
  );
};