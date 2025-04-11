import { useContext, useEffect } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { AppTextNoTheme } from "./AppText";
import { ThemeContext } from "../../theme/AppContext";

export const AppToast = ({ visible, onClose, message }: any) => {
    const { navTheme } = useContext(ThemeContext);
    const { colors } = navTheme;
    useEffect(() => {
        let timer: any;
        if (visible) {
            timer = setTimeout(() => {
                onClose();
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [visible, onClose]);

    return (
        <View style={styles.wrapperStyle}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.containerM}>
                    <View style={[styles.modalView, { backgroundColor: colors.toast }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <AppTextNoTheme langOption={'english'} text={message}></AppTextNoTheme>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    containerM: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center'
    },
    modalView: {
        borderRadius: 20,
        alignItems: "center",
        paddingVertical: 17,
        paddingHorizontal: 24,
        elevation: 5,
        bottom: 80
    },
    wrapperStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        pointerEvents: 'none'
    }
});