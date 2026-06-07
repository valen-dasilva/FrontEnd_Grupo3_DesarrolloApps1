import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TeatroColonIcon from '../../assets/images/Imagen-Teatro-Colon.svg';
import { icons } from '../../constants/icons';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { paddings } from '../../constants/paddings';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
    title?: string;
    category?: string;
    dateRange?: string;
    description?: string;
    onBackPress?: () => void;
    onEditPress?: () => void;
};

const categoryIconMap: Record<string, string> = {
    'Cultura': icons.Museum,
    'Naturaleza': icons.Landscape,
    'Gastronomía': icons.Restaurant,
    'Gastronomia': icons.Restaurant,
    'Aventura': icons.Hiking,
    'Noche': icons.Nightlife,
    'Compras': icons.ShoppingBag,
    'Compra': icons.ShoppingBag,
};

export function CardItinerarioInfoFav({
    title = "Teatro Colón",
    category = "Cultura",
    dateRange = "15 Oct - 22 Oct, 2024",
    description = "Visita guiada por el emblemático Teatro Colón, descubriendo su historia, arquitectura y secretos detrás del escenario.",
    onBackPress,
    onEditPress
}: Props) {
    const [isFavorite, setIsFavorite] = useState(true);

    const categoryIcon = categoryIconMap[category || ''] || icons.Museum;
    
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? colors.dark : colors.light;

    return (
        <View>
            {/** Contenedor de la imagen */}
            <View style={styles.contenedorImagen}>
                {/** Imagen superpuesta con texto */}
                <TeatroColonIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFillObject} />

                {/** Capa superpuesta con filtro oscuro trasparente */}
                <View style={styles.heroOverlay}>

                    {/* Iconos de atras y corazon */}
                    <View style={styles.heroTopBar}>

                        {/** Boton de atras */}
                        <TouchableOpacity style={[styles.contenedorCircular, { backgroundColor: theme.surface }]} onPress={onBackPress}>
                            <MaterialIcons name={icons.ArrowBack} size={20} color={theme.text} />
                        </TouchableOpacity>

                        {/** Boton de corazon */}
                        <TouchableOpacity style={[styles.contenedorCircular, { backgroundColor: theme.surface }]} onPress={() => setIsFavorite(!isFavorite)}>
                            <MaterialIcons 
                                name={isFavorite ? icons.FavoriteFilled : icons.FavoriteOutline} 
                                size={21} 
                                color={theme.danger} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/** Contenido de la parte inferior de la imagen */}
                    <View style={styles.contenedorInfoInferior}>

                        {/** Insignia de la categoria */}
                        <View style={[styles.etiquetaCategoria, { backgroundColor: theme.surface }]}>
                            <MaterialIcons 
                                name={categoryIcon as any} 
                                size={16} 
                                color={theme.text} 
                                style={{ marginRight: 4 }} 
                            />
                            <Text style={[styles.etiquetaCategoriaTexto, { color: theme.text }]}>{category}</Text>
                        </View>

                        <Text style={styles.titulo}>{title}</Text>

                        <View style={styles.contenedorFechasIconos}>

                            {/** Fechas */}
                            <View style={styles.fechas}>
                                <MaterialIcons name={icons.CalendarToday} size={16} color="#FFFFFF" />
                                <Text style={styles.fechasTexto}>{dateRange}</Text>
                            </View>

                            {/** Iconos de descarga y editar */}
                            <View style={styles.contenedorIconosDescargaEditar}>
                                <TouchableOpacity>
                                    <MaterialIcons name={icons.Download} size={23} color="#FFFFFF" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onEditPress}>
                                    <MaterialIcons name={icons.Edit} size={23} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>
            </View>

            {/* Descripción */}
            <Text style={[styles.descripcion, { color: theme.textSecondary }]}>
                {description}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedorImagen: {
        width: '100%',
        height: 280,
        marginTop: paddings.spacing.sm,
        borderRadius: paddings.radius.xxl, // 24px
        overflow: 'hidden',
        position: 'relative',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    heroOverlay: {
        flex: 1,
        padding: paddings.spacing.lg, // 16px
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    heroTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contenedorCircular: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contenedorInfoInferior: {
        gap: paddings.spacing.sm,
    },
    etiquetaCategoria: {
        backgroundColor: colors.surface,
        paddingHorizontal: paddings.spacing.md,
        paddingVertical: paddings.spacing.xs,
        borderRadius: paddings.radius.round,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    etiquetaCategoriaTexto: {
        color: colors.text,
        fontSize: fonts.size.xs,
        fontFamily: fonts.family.bodySemiBold,
        fontWeight: fonts.weight.semibold,
        marginLeft: 2,
    },
    titulo: {
        color: colors.textInverse,
        fontSize: fonts.size.xxxl, // 32px
        fontFamily: fonts.family.headingBold,
        fontWeight: fonts.weight.bold,
        lineHeight: 36,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    contenedorFechasIconos: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    fechas: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 6,
    },
    fechasTexto: {
        color: colors.textInverse,
        fontSize: fonts.size.sm, // 14px
        fontFamily: fonts.family.bodySemiBold,
        fontWeight: fonts.weight.semibold,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    contenedorIconosDescargaEditar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 27,
    },
    descripcion: {
        fontSize: fonts.size.md, // 16px
        fontFamily: fonts.family.bodyRegular,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: paddings.spacing.xl,
        marginBottom: paddings.spacing.xxl,
    },
});
