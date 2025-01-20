import { useState } from 'react'
import { MantineProvider, Container, Title, Text, Stack, Button, rem, Paper, Group } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { IconUpload, IconPhoto, IconX, IconLogout } from '@tabler/icons-react'
import heic2any from 'heic2any'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './components/AuthPage'

function ConverterApp() {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [files, setFiles] = useState([])
  const [converting, setConverting] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setFiles([]);
      setConverting(false);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!currentUser) {
    return <AuthPage />;
  }

  const handleDrop = (droppedFiles) => {
    setFiles(droppedFiles)
  }

  const convertFiles = async () => {
    setConverting(true)
    try {
      for (const file of files) {
        const blob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${file.name.replace(/\.heic$/i, '')}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Conversion error:', error)
    }
    setConverting(false)
    setFiles([])
  }

  return (
    <>
      <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 1000, padding: '10px 24px' }}>        
        <Button 
          variant="subtle" 
          color="red" 
          loading={isLoggingOut}
          onClick={handleLogout}
          leftIcon={<IconLogout size={18} />}
          style={{ transition: 'all 0.2s ease' }}
          size="sm"
        >
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
      <Container size="sm" py="xl" style={{ marginTop: '4rem' }}>
        <Paper shadow="sm" p="xl" radius="lg" className="animate-fade-in">          
          <Stack spacing="xl">
            <div>
              <Title order={1} align="center" className="animate-fade-in">HEIC to JPG Converter!</Title>
              <Text align="center" color="dimmed" size="lg" mt="md">
                Drop your HEIC files here to convert them to JPG format.
              </Text>
            </div>
            
            <Dropzone
              onDrop={handleDrop}
              accept={['image/heic']}
              maxSize={30 * 1024 * 1024}
              style={{ borderRadius: rem(16), width: '300px', height: '300px', margin: '0 auto' }}
              className="animate-fade-in"
            >
              {(status) => (
                <Stack align="center" spacing="lg" style={{ height: '100%', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: '1rem' }}>
                    {status.accepted && <IconUpload size={rem(120)} stroke={2} color="#228be6" />}
                    {status.rejected && <IconX size={rem(120)} stroke={1.5} color="#FA5252" />}
                    {!status.accepted && !status.rejected && <IconPhoto size={rem(120)} stroke={1.5} color="#228be6" />}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text size="xl" weight={500}>
                      {files.length > 0 
                        ? `${files.length} file(s) selected`
                        : 'Drag HEIC images here or click to select'}
                    </Text>
                    <Text size="sm" color="dimmed" mt="xs">
                      Files should not exceed 30MB
                    </Text>
                    {files.length > 0 && (
                      <Stack mt="lg" spacing="xs" className="file-list">
                        {files.map((file, index) => (
                          <Text key={index} size="sm" color="dimmed">
                            {file.name}
                          </Text>
                        ))}
                      </Stack>
                    )}
                  </div>
                </Stack>
              )}
            </Dropzone>

            {files.length > 0 && (
              <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Text size="md" color="dimmed">
                  Selected files:
                </Text>
                {files.map((file, index) => (
                  <Text key={index} weight={500} size="lg">
                    {file.name}
                  </Text>
                ))}
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <Button
                onClick={convertFiles}
                loading={converting}
                variant="filled"
                size="xl"
                className="animate-fade-in"
                disabled={files.length === 0}
              >
                {converting ? 'Converting...' : 'Convert to JPG'}
              </Button>
            </div>
          </Stack>
        </Paper>
      </Container>
    </>
  )
}

function App() {
  return (
    <MantineProvider withNormalizeCSS>
      <AuthProvider>
        <ConverterApp />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App
