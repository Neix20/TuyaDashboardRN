import React, { useState, useEffect } from "react";
import { Divider } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { ListItem } from '@rneui/themed';
import { useToggle } from "@hooks";

import { Utility } from "@utility";

function AccordionTitle(props) {
    const { children } = props;
    return (
        <ListItem.Content>
            <ListItem.Title style={{
                fontFamily: "Roboto-Bold",
                fontSize: 16,
                color: "#1E1E1E",
            }}>{children}</ListItem.Title>
        </ListItem.Content>
    )
}

function AccordionItem(props) {

    const { title = "", description = "" } = props;
    const [expanded, setExpanded, toggleExpanded] = useToggle(false);

    return (
        <ListItem.Accordion
            content={<AccordionTitle>{title}</AccordionTitle>}
            isExpanded={expanded}
            onPress={toggleExpanded}
            animation={{
                duration: 100,
                type: "timing"
            }}
            icon={<FontAwesome5 name={"chevron-down"} color={Utility.getColor()} size={20} />}
            containerStyle={{ paddingHorizontal: 0, paddingVertical: 5 }}
        >
            <ListItem containerStyle={{ padding: 0 }}>
                <ListItem.Content>
                    <ListItem.Title>{description}</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </ListItem.Accordion>
    );
}

function Index(props) {
    const { data = [] } = props;

    if (data.length == 0) {
        return (<></>);
    }

    const renderItem = (item, index) => (
        <>
            <AccordionItem key={index} {...item} />
            <Divider bgColor={"#EBEBEB"} my={2} />
        </>
    )
    return data.map(renderItem);
}

export default Index;