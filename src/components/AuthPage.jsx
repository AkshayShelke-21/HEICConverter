import { useState } from 'react';
import { Container, Title, Text, Stack, Button, Paper } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { loginWithGoogle } = useAuth();
  const [authError, setAuthError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setAuthError('');
      await loginWithGoogle();
      window.location.reload();
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <Container size="xs" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: 0 }}>
      <Paper shadow="sm" p="xl" radius="lg" className="animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Stack spacing="xl" align="center" style={{ width: '100%', height: '100%', justifyContent: 'space-between' }}>
          <Title order={1} align="center" style={{ fontSize: '1.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>Welcome to HEIC Converter!</Title>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '200px' }}>
            {authError && (
              <Text color="red" size="sm" style={{ marginBottom: '1rem' }}>{authError}</Text>
            )}
            <Button
              variant="outline"
              leftIcon={<IconBrandGoogle size={20} />}
              onClick={handleGoogleLogin}
              fullWidth
              size="lg"
            >
              Continue with Google
            </Button>
          </div>
          <div /> {/* Spacer element for better vertical distribution */}
        </Stack>
      </Paper>
    </Container>
  );
}