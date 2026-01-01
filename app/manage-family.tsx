import { GlassView } from 'expo-glass-effect';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Alert, Image, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import SoftRadialGradient from '../src/components/shared/soft-radial-gradient';

const MOCK_FAMILY = [
    {
        id: '1',
        name: 'Param Singh',
        role: 'Admin',
        image: require('../assets/images/family/param_avatar.jpg'),
        isYou: true,
    },
    {
        id: '2',
        name: 'Sarah Singh',
        role: 'Spouse',
        image: null, // Fallback
        color: '#FF9F0A',
    },
    {
        id: '3',
        name: 'Aria Singh',
        role: 'Child',
        image: null,
        color: '#5E5CE6',
    },
];

export default function ManageFamilyScreen() {
    const insets = useSafeAreaInsets();
    const { theme } = useUnistyles();

    const handleMemberOptions = (member: typeof MOCK_FAMILY[0]) => {
        if (member.isYou) {
            Alert.alert('Your Profile', 'You can edit your details in the main settings page.', [
                { text: 'OK' }
            ]);
            return;
        }

        Alert.alert(
            member.name,
            'Manage this family member',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Edit Role', onPress: () => console.log('Edit role') },
                {
                    text: 'Remove from Family',
                    style: 'destructive',
                    onPress: () => console.log('Remove member')
                }
            ]
        );
    };

    const handleInvite = async () => {
        try {
            await Share.share({
                message: 'Join my family circle on Lifelong! Use this link to join: https://lifelong.app/join/family-id-123',
                title: 'Invite to Lifelong',
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <SoftRadialGradient />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <SymbolView name="chevron.left" tintColor={theme.colors.text.primary} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Family</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: insets.bottom + 40 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.intro}>
                    <Text style={styles.introTitle}>Your Household</Text>
                    <Text style={styles.introSubtitle}>
                        Manage members, roles, and permissions for your longevity circle.
                    </Text>
                </View>

                {/* Members List */}
                <GlassView style={styles.listContainer} glassEffectStyle="regular">
                    {MOCK_FAMILY.map((member, index) => (
                        <View key={member.id}>
                            {index > 0 && <View style={styles.separator} />}
                            <View style={styles.memberRow}>
                                {/* Avatar */}
                                <View style={[styles.avatarContainer, { backgroundColor: member.color || theme.colors.surface.card }]}>
                                    {member.image ? (
                                        <Image source={member.image} style={styles.avatar} />
                                    ) : (
                                        <Text style={styles.avatarInitial}>{member.name[0]}</Text>
                                    )}
                                </View>

                                {/* Info */}
                                <View style={styles.memberInfo}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                        {member.isYou && <View style={styles.youBadge}><Text style={styles.youText}>YOU</Text></View>}
                                    </View>
                                    <Text style={styles.memberRole}>{member.role}</Text>
                                </View>

                                {/* Action */}
                                <TouchableOpacity
                                    style={styles.moreButton}
                                    onPress={() => handleMemberOptions(member)}
                                    activeOpacity={0.6}
                                >
                                    <SymbolView name="ellipsis" tintColor={theme.colors.text.muted} style={styles.moreIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </GlassView>

                {/* Invite Action */}
                <TouchableOpacity
                    style={styles.inviteButton}
                    activeOpacity={0.8}
                    onPress={handleInvite}
                >
                    <GlassView style={styles.inviteGlass} glassEffectStyle="regular">
                        <View style={styles.inviteIconContainer}>
                            <SymbolView name="person.badge.plus" tintColor="#fff" style={styles.inviteIcon} />
                        </View>
                        <View style={styles.inviteContent}>
                            <Text style={styles.inviteTitle}>Invite New Member</Text>
                            <Text style={styles.inviteSubtitle}>Send an invitation link</Text>
                        </View>
                        <SymbolView name="chevron.right" tintColor={theme.colors.text.muted} style={styles.chevron} />
                    </GlassView>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        ...theme.typography.headline,
        color: theme.colors.text.primary,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 12,
        gap: 24,
    },
    intro: {
        gap: 8,
        marginBottom: 8,
    },
    introTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text.primary,
        letterSpacing: -0.5,
    },
    introSubtitle: {
        fontSize: 15,
        color: theme.colors.text.secondary,
        lineHeight: 22,
    },
    // List
    listContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border.divider,
        marginLeft: 80, // Offset for avatar
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarInitial: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    memberInfo: {
        flex: 1,
        gap: 4,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    memberName: {
        fontSize: 17,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    youBadge: {
        backgroundColor: theme.colors.surface.card,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    youText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.text.secondary,
    },
    memberRole: {
        fontSize: 14,
        color: theme.colors.text.secondary,
    },
    moreButton: {
        padding: 8,
    },
    moreIcon: {
        width: 20,
        height: 20,
    },
    // Invite
    inviteButton: {
        marginTop: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    inviteGlass: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
        backgroundColor: 'rgba(50, 150, 255, 0.1)', // Subtle tint
    },
    inviteIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inviteIcon: {
        width: 20,
        height: 20,
    },
    inviteContent: {
        flex: 1,
        gap: 2,
    },
    inviteTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.brand.primary,
    },
    inviteSubtitle: {
        fontSize: 13,
        color: theme.colors.text.secondary,
    },
    chevron: {
        width: 14,
        height: 14,
        opacity: 0.5,
    },
}));
