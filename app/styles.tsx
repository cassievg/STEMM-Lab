import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    page: {
        padding: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },

    title_container: {
        width: '70%',
    },

    page_title: {
        fontSize: 30,
        textAlign: 'center',
        paddingBottom: '5%',
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS, Roboto, sans-serif'
    },

    text: {
        fontSize: 15,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif'
    },

    image: {
        width: '70%',
        height: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
    },

    button_parent: {
        width: '70%',
        height: '7%',
        display: 'flex',
        marginTop: '10%',
    },

    pressable_default: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#afdaff',
        borderRadius: 15,
    },

    pressable_onPress: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97b9d6',
        borderRadius: 15,
    },

    button_text: {
        fontSize: 20,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        width: '100%',
        textAlign: 'center',
    },
});