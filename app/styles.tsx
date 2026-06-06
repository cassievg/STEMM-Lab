import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        paddingVertical: 10,
        marginBottom: '5%'
    },

    back_button: {
        borderWidth: 1,
        borderColor: '#97b9d6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 16,
        borderRadius: 4,
        zIndex: 1,
    },

    page: {
        padding: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },

    title_container: {
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    page_title: {
        position: 'absolute',
        left: 0,
        right: 0,
        fontSize: 25,
        textAlign: 'center',
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

    button_big_text: {
        fontSize: 20,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        width: '100%',
        textAlign: 'center',
    },

    button_normal_text: {
        fontSize: 15,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        width: '100%',
        textAlign: 'center',
    },
});