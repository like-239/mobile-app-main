import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

const BalanceUpdateModal = ({ isVisible, onSubmit, onCancel }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            inputRef.current.focus();
        }
    }, [isVisible]);

    const handleSubmit = () => {
        if (inputValue.trim() !== '') {
            onSubmit(inputValue);
            setInputValue('');  // Clear the input after submitting
            onCancel();  // Close the modal
        } else {
            alert('Please enter a valid number');
        }
    };

    return (
        
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
            
                    <TextInput
                        ref={inputRef}
                        style={styles.modalText}
                        onChangeText={setInputValue}
                        value={inputValue}
                        keyboardType="numeric"
                        placeholder="Enr new balance"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                    />
                    <Button title="Submit" onPress={handleSubmit} />
                    <Button title="Cancel" onPress={onCancel} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default BalanceUpdateModal;
