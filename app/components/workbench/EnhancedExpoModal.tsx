import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogRoot } from '~/components/ui/Dialog';
import { Button } from '~/components/ui/Button';
import { useStore } from '@nanostores/react';
import { expoUrlAtom } from '~/lib/stores/qrCodeStore';
import { workbenchStore } from '~/lib/stores/workbench';
import { QRCode } from 'react-qrcode-logo';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

interface ExpoTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  files: Record<string, string>;
  dependencies: Record<string, string>;
  category: 'navigation' | 'ui' | 'auth' | 'data' | 'basic';
}

interface EnhancedExpoModalProps {
  open: boolean;
  onClose: () => void;
}

const EXPO_TEMPLATES: ExpoTemplate[] = [
  {
    id: 'basic',
    name: 'Basic App',
    description: 'Simple React Native app with basic structure',
    icon: 'i-ph:rocket',
    category: 'basic',
    files: {
      'App.tsx': `import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Welcome to Expo!</Text>
      <Text style={styles.subtitle}>Start building your app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});`,
      'package.json': JSON.stringify({
        name: 'expo-basic-app',
        version: '1.0.0',
        main: 'node_modules/expo/AppEntry.js',
        scripts: {
          start: 'expo start',
          android: 'expo start --android',
          ios: 'expo start --ios',
          web: 'expo start --web',
        },
        dependencies: {
          expo: '~50.0.0',
          'react': '18.2.0',
          'react-native': '0.73.0',
        },
      }, null, 2),
    },
    dependencies: {
      expo: '~50.0.0',
      'react': '18.2.0',
      'react-native': '0.73.0',
    },
  },
  {
    id: 'navigation',
    name: 'Navigation App',
    description: 'App with React Navigation setup',
    icon: 'i-ph:map-trifold',
    category: 'navigation',
    files: {
      'App.tsx': `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
      'screens/HomeScreen.tsx': `import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});`,
      'screens/DetailsScreen.tsx': `import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DetailsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Button
        title="Go back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});`,
    },
    dependencies: {
      expo: '~50.0.0',
      'react': '18.2.0',
      'react-native': '0.73.0',
      '@react-navigation/native': '^6.1.0',
      '@react-navigation/native-stack': '^6.9.0',
      'react-native-screens': '~3.29.0',
      'react-native-safe-area-context': '4.8.2',
    },
  },
  {
    id: 'auth',
    name: 'Authentication',
    description: 'App with authentication flow',
    icon: 'i-ph:shield-check',
    category: 'auth',
    files: {
      'App.tsx': `import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? (
    <HomeScreen onLogout={() => setIsAuthenticated(false)} />
  ) : (
    <LoginScreen onLogin={() => setIsAuthenticated(true)} />
  );
}`,
      'screens/LoginScreen.tsx': `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      onLogin();
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});`,
    },
    dependencies: {
      expo: '~50.0.0',
      'react': '18.2.0',
      'react-native': '0.73.0',
    },
  },
  {
    id: 'todo',
    name: 'Todo List',
    description: 'Simple todo list app with state management',
    icon: 'i-ph:list-checks',
    category: 'data',
    files: {
      'App.tsx': `import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AddTodo onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
});`,
    },
    dependencies: {
      expo: '~50.0.0',
      'react': '18.2.0',
      'react-native': '0.73.0',
    },
  },
];

const CATEGORIES = [
  { id: 'basic', name: 'Basic', icon: 'i-ph:rocket' },
  { id: 'navigation', name: 'Navigation', icon: 'i-ph:map-trifold' },
  { id: 'auth', name: 'Authentication', icon: 'i-ph:shield-check' },
  { id: 'data', name: 'Data', icon: 'i-ph:database' },
  { id: 'ui', name: 'UI Components', icon: 'i-ph:palette' },
];

export const EnhancedExpoModal: React.FC<EnhancedExpoModalProps> = ({ open, onClose }) => {
  const expoUrl = useStore(expoUrlAtom);
  const [currentView, setCurrentView] = useState<'qr' | 'templates'>('qr');
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');
  const [isCreating, setIsCreating] = useState(false);

  const filteredTemplates = EXPO_TEMPLATES.filter(
    (template) => template.category === selectedCategory
  );

  const handleCreateTemplate = async (template: ExpoTemplate) => {
    try {
      setIsCreating(true);

      // Create all template files
      for (const [filePath, content] of Object.entries(template.files)) {
        await workbenchStore.createFile(filePath, content);
      }

      toast.success(`Created ${template.name} template successfully!`);
      onClose();
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog
        className="text-center !flex-col !mx-auto !max-w-4xl"
        showCloseButton={true}
        onClose={onClose}
      >
        <div className="border !border-bolt-elements-borderColor flex flex-col gap-5 p-6 bg-bolt-elements-background-depth-2 rounded-md">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="i-bolt:expo-brand h-8 w-8 invert dark:invert-none"></div>
              <DialogTitle className="text-bolt-elements-textPrimary text-xl font-semibold">
                Expo Development
              </DialogTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant={currentView === 'qr' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentView('qr')}
              >
                <div className="i-ph:qr-code mr-2"></div>
                QR Code
              </Button>
              <Button
                variant={currentView === 'templates' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentView('templates')}
              >
                <div className="i-ph:files mr-2"></div>
                Templates
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentView === 'qr' ? (
              <motion.div
                key="qr"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-5"
              >
                <DialogDescription className="bg-bolt-elements-background-depth-3 max-w-md rounded-md p-3 border border-bolt-elements-borderColor">
                  Scan this QR code with the Expo Go app on your mobile device to preview your project.
                </DialogDescription>

                <div className="flex flex-col items-center">
                  {expoUrl ? (
                    <QRCode
                      logoImage="/favicon.svg"
                      removeQrCodeBehindLogo={true}
                      logoPadding={3}
                      logoHeight={50}
                      logoWidth={50}
                      logoPaddingStyle="square"
                      style={{
                        borderRadius: 16,
                        padding: 2,
                        backgroundColor: '#8a5fff',
                      }}
                      value={expoUrl}
                      size={200}
                    />
                  ) : (
                    <div className="text-bolt-elements-textSecondary text-center p-8 border-2 border-dashed border-bolt-elements-borderColor rounded-lg">
                      <div className="i-ph:qr-code text-4xl mb-2"></div>
                      <p>No Expo URL detected</p>
                      <p className="text-sm">Start your Expo development server</p>
                    </div>
                  )}
                </div>

                {expoUrl && (
                  <div className="text-xs text-bolt-elements-textTertiary bg-bolt-elements-background-depth-3 px-3 py-2 rounded border">
                    <code>{expoUrl}</code>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="templates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <DialogDescription className="text-center">
                  Choose a template to quickly start your React Native project with Expo.
                </DialogDescription>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className={`${category.icon} mr-2`}></div>
                      {category.name}
                    </Button>
                  ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border border-bolt-elements-borderColor rounded-lg p-4 bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-3 transition-colors cursor-pointer"
                      onClick={() => handleCreateTemplate(template)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`${template.icon} text-2xl text-bolt-elements-button-primary-background flex-shrink-0 mt-1`}></div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-bolt-elements-textPrimary mb-1">
                            {template.name}
                          </h3>
                          <p className="text-sm text-bolt-elements-textSecondary mb-3">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {Object.keys(template.dependencies).slice(0, 3).map((dep) => (
                              <span
                                key={dep}
                                className="text-xs bg-bolt-elements-button-primary-background text-white px-2 py-1 rounded"
                              >
                                {dep}
                              </span>
                            ))}
                            {Object.keys(template.dependencies).length > 3 && (
                              <span className="text-xs text-bolt-elements-textTertiary">
                                +{Object.keys(template.dependencies).length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-8 text-bolt-elements-textSecondary">
                    <div className="i-ph:folder-open text-4xl mb-2"></div>
                    <p>No templates available in this category</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-bolt-elements-borderColor">
            <div className="text-sm text-bolt-elements-textTertiary">
              {currentView === 'qr'
                ? 'Use Expo Go app to scan and preview'
                : `${filteredTemplates.length} templates available`
              }
            </div>
            {isCreating && (
              <div className="flex items-center gap-2 text-sm text-bolt-elements-textPrimary">
                <div className="i-ph:spinner animate-spin"></div>
                Creating template...
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </DialogRoot>
  );
};