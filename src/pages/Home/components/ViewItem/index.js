import { View} from "react-native";
import { useMemo, useState } from "react";

import { ViewItemStyles } from "./styles";
import ViewModal from "../../../../components/ViewModal"
import FooterIconButton from "../../../../components/FooterIconButton";
import TabButtons from "./components/TabButtons";
import EditButtons from "./components/EditButtons";
import QuantityEdit from "./components/InfoTab/components/QuantityEdit";

import InfoTab from "./components/InfoTab";
import HistoryTab from "./components/HistoryTab";
import QRTab from "./components/QRTab";

import {colors} from "../../../../assets/styles"

export default function ViewItem({visible, onClose}){
    const [selectedTab, setSelectedTab] = useState("info");

    const footer =
      selectedTab === "info" ? (
        <QuantityEdit />
      ) : selectedTab === "history" ? (
        <FooterIconButton iconName="calendar-outline" text="History" color={colors.boldColor} />
      ) : selectedTab === "qr" ? (
        <FooterIconButton iconName="download-outline" text="History" color={colors.boldColor} />
      ): null;

    const tabs = (
        <View style={ViewItemStyles.tabs}>
            <TabButtons selectedTab={selectedTab} onSelectTab={setSelectedTab}/>
            {selectedTab === "info" && <EditButtons />}
        </View>
    );

    const tabContent = useMemo(() => {
        switch (selectedTab) {
          case "info":
            return <InfoTab />;
          case "history":
            return <HistoryTab />;
          case "qr":
            return <QRTab />;
          default:
            return <InfoTab />;
        }
      }, [selectedTab]);
    
    return(
        <ViewModal visible={visible} onClose={onClose}   title="Inventory 1" tabs={tabs} footer={footer}>
         
            <View style={ViewItemStyles.container}>{tabContent}</View>
        </ViewModal>
    );
};