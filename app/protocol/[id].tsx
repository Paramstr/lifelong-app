import ProtocolDetailsScreen from '@/features/home/screens/ProtocolDetailsScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ProtocolDetailsRoute() {
  const { id } = useLocalSearchParams();
  return <ProtocolDetailsScreen protocolId={id as string} />;
}
