import { ScrollView, View, StyleSheet } from "react-native";

import ViewModal from "../../components/ViewModal";
import FooterTextButton from "../../components/FooterTextButton";
import InputBox from "../../components/InputBox";
import { colors } from "../../assets/styles";


export default function Signup({ visible, onClose }) {
  const footer = (
    <>
      <FooterTextButton text="Register" color={colors.boldColor} textColor={colors.brandHighlight} />
    </>
  );

  return (
    <ViewModal visible={visible} onClose={onClose} title="Sign Up" footer={footer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <InputBox title="Full name" />
        <InputBox title="Email" />
        <InputBox title="Password" />
        <InputBox title="Confirm password" />
        <View style={{ height: 16 }} />
      </ScrollView>
    </ViewModal>
  );
}

const styles= StyleSheet.create({
    container:{
        padding:16,
    },
});