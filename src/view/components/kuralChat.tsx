import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { askKuralAI } from '../../service/remote/api/ai';


export default function KuralChat() {
    const [messages, setMessages] = useState([
        {
            id: '0',
            role: 'assistant',
            content: 'வணக்கம்! 🙏 Ask me anything about Thirukkural — meanings, themes, or real-life lessons!'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now().toString(), role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // Build history for API (exclude the first welcome message)
            const history = newMessages
                .slice(1)
                .map(m => ({ role: m.role, content: m.content }));

            const reply = await askKuralAI(input, history.slice(0, -1));

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: reply
            }]);
        } catch (err) {
            console.log('ERROR:', err);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '⚠️ Something went wrong. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.bubble,
                        item.role === 'user' ? styles.userBubble : styles.aiBubble
                    ]}>
                        <Text style={styles.bubbleText}>{item.content}</Text>
                    </View>
                )}
                contentContainerStyle={{ padding: 16 }}
            />

            {loading && <ActivityIndicator style={{ margin: 8 }} />}

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask about any Kural..."
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF8F0' },
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
    userBubble: { backgroundColor: '#C8522B', alignSelf: 'flex-end' },
    aiBubble: { backgroundColor: '#F0E6D3', alignSelf: 'flex-start' },
    bubbleText: { fontSize: 15, color: '#222' },
    inputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: '#ddd' },
    input: { flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#ddd' },
    sendBtn: { marginLeft: 8, backgroundColor: '#C8522B', borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center' },
    sendText: { color: '#fff', fontWeight: 'bold' },
});