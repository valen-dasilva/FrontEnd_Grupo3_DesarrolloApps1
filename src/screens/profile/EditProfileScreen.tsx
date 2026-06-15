import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import { UserAvatar } from "@/components/common/UserAvatar/UserAvatar";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
} from "react-native";

export default function EditarUsuarioScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Ref para evitar que el useEffect vuelva a sobreescribir los datos
  const profileLoaded = useRef(false);

  const { theme } = useTheme();

  useEffect(() => {
    if (user?.idUsuario && !profileLoaded.current) {
      profileLoaded.current = true;
      setNombre(user.nombre);
      setCorreo(user.email);
      setFotoPerfil(user.fotoPerfil);

      setLoading(true);
      getUserProfile(user.idUsuario)
        .then((profile) => {
          setNombre(profile.nombre);
          setApellido(profile.apellido || "");
          setCorreo(profile.email);
          setFotoPerfil((current) => current ?? profile.fotoPerfil);
        })
        .catch((err) => {
          console.error("Error al cargar perfil:", err);
          Alert.alert("Error", "No se pudo cargar la información completa del perfil.");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert("Campos incompletos", "Nombre y apellido son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const updatedProfile = await updateUserProfile(user!.idUsuario, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo,
        fotoPerfil: fotoPerfil,
      });

      await updateUser({
        nombre: updatedProfile.nombre,
        fotoPerfil: updatedProfile.fotoPerfil,
      });

      Alert.alert("Éxito", "Perfil actualizado correctamente.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error("Error al guardar perfil:", err);
      Alert.alert("Error", err.message || "No se pudieron guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarContainer}>
          <UserAvatar
            uri={fotoPerfil}
            nombre={nombre}
            apellido={apellido}
            size={90}
          />
        </View>

        {loading && <ActivityIndicator size="small" color={theme.primary} style={{ marginVertical: 10 }} />}

        <Text style={[styles.label, { color: theme.text }]}>Nombre</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Nombre"
          placeholderTextColor={theme.textSecondary}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={[styles.label, { color: theme.text }]}>Apellido</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Apellido"
          placeholderTextColor={theme.textSecondary}
          value={apellido}
          onChangeText={setApellido}
        />

        <Text style={[styles.label, { color: theme.text }]}>Correo Electrónico (No modificable)</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
              opacity: 0.6,
            },
          ]}
          editable={false}
          value={correo}
        />

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? "Guardando..." : "✓  Guardar Cambios"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerBtn, { backgroundColor: theme.danger }]}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.dangerBtnText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  avatarContainer: {
    alignSelf: "center",
    marginVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  primaryBtn: {
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 24,
  },
  primaryBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  dangerBtn: {
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  dangerBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
});