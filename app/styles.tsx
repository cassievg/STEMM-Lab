import { StyleSheet } from "react-native";

export const globalColors = {
    light : StyleSheet.create({
        page: {
            backgroundColor: '#ffffff'
        },

        text: {
            color: '#000000'
        },

        container: {
            color: '#afdaff',
            borderColor: '#6798c3'
        },

        back: {
            borderColor: '#97b9d6',
            backgroundColor: '#ffffff'
        },

        pressable_default: {
            backgroundColor: '#afdaff',
        },

        pressable_onPress: {
            backgroundColor: '#97b9d6',
        },

        tab_bar: {
            borderBottomColor: '#97b9d6',
            backgroundColor: '#ffffff',
        },

        tab_active: {
            borderBottomColor: '#97b9d6',
            backgroundColor: '#ffffff',
        },
        
        tab_label: {
            color: '#888888',
        },

        tab_label_active: {
            color: '#111111',
        },

        card_box: {
            borderColor: '#97b9d6',
            backgroundColor: '#afdaff',
        },

        separator: {
            backgroundColor: '#97b9d6'
        }
    }),
    
    dark : StyleSheet.create({
        page: {
            backgroundColor: '#323232'
        },

        text: {
            color: '#d8d8d8'
        },

        container: {
            backgroundColor: '#2b2b2b',
            borderColor: '#656565'
        },

        back: {
            borderColor: '#656565',
            backgroundColor: '#2b2b2b'
        },

        pressable_default: {
            backgroundColor: '#474747',
        },

        pressable_onPress: {
            backgroundColor: '#656565',
        },

        tab_bar: {
            borderBottomColor: '#d8d8d8',
            backgroundColor: '#505050'
        },

        tab_active: {
            backgroundColor: '#707070',
            borderBottomColor: '#d8d8d8',
        },
        
        tab_label: {
            color: '#d8d8d8',
        },

        tab_label_active: {
            color: '#e2e2e2',
        },

        card_box: {
            backgroundColor: '#434343',
            borderColor: '#656565'
        },

        separator: {
            backgroundColor: '#656565',
        }
    })
}

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
        borderRadius: 15,
    },

    pressable_onPress: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
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

    tab_bar: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        marginBottom: 20,
    },

    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
    },

    tab_label: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        fontWeight: '400',
        textAlign: 'center',
        width: '100%'
    },

    tab_label_active: {
        fontWeight: '800',
    },
});