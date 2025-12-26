
import {ScrollView,Text } from "react-native"; 
import { useEffect, useState } from "react";

import {styles} from "./styles";
import ViewModal from "../../../../components/ViewModal"
import FooterTextButton from "../../../../components/FooterTextButton";

import {colors} from "../../../../assets/styles"
import InputBox from "../../../../components/InputBox"
import InputProperty from "./InputProperty";
import AddProperty from "./AddProperty";


export default function NewTemplateCard({ visible, onClose, onCreate, loading, error }) {

    const [name, setName] = useState("");

    const [properties, setProperties] = useState([""]);

    const addProperty = () => setProperties((p) => [...p, ""]);

    const updateProperty = (index, value) =>
    setProperties((p) => p.map((v, i) => (i === index ? value : v)));

    const deleteProperty = (index) =>
    setProperties((p) => (p.length > 1 ? p.filter((_, i) => i !== index) : p));

    const trimmedProperties = properties.map((p) => p.trim()).filter(Boolean);

    const footer = (
        <>
        <FooterTextButton
        text={loading ? "Creating..." : "Create"}
        color={colors.boldColor}
        textColor={colors.brandHighlight}
        onPress={() => onCreate?.(name, trimmedProperties)}
        disabled={loading || !name.trim() || trimmedProperties.length === 0}
        />
        </>

    );

    useEffect(() => {
        if (!visible) setName("");
      }, [visible]);

      useEffect(() => {
        if (!visible) {
          setName("");
          setProperties([""]);
        }
      }, [visible]);

    



    return(
        <ViewModal visible={visible} onClose={onClose} title="New Template" footer={footer}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <InputBox title="Name" value={name} onChangeText={setName} />
                {!!error && <Text style={{ color: colors.red, marginTop: 8 }}>{error}</Text>}
                {properties.map((prop, idx) => (
                <InputProperty
                    key={idx}
                    title={`Property ${idx + 1}`}
                    value={prop}
                    onChangeText={(t) => updateProperty(idx, t)}
                    showDelete={properties.length > 1}
                    onDelete={() => deleteProperty(idx)}
                />
                ))}
                <AddProperty onPress={addProperty} />


            </ScrollView>
      </ViewModal>
    );
};