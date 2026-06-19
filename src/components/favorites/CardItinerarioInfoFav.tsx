import React from 'react';
import { ItineraryInfoCard } from '../Explorar/CardItinerarioInfo';

type Props = {
    title?: string;
    imageUrl?: string;
    images?: readonly string[];
    category?: string;
    dateRange?: string;
    description?: string;
    onBackPress?: () => void;
    onEditPress?: () => void;
    onDownloadPress?: () => void;
    idItinerario?: number;
    isFavorite?: boolean;
    idFavorito?: number;
};

export function CardItinerarioInfoFav({
    title,
    imageUrl,
    images,
    category,
    dateRange,
    description,
    onBackPress,
    onEditPress,
    onDownloadPress,
    idItinerario,
    isFavorite = true,
    idFavorito,
}: Props) {
    return (
        <ItineraryInfoCard
            idItinerario={idItinerario}
            title={title}
            image={imageUrl}
            images={images}
            category={category}
            dateRange={dateRange}
            description={description}
            onBackPress={onBackPress}
            onEditPress={onEditPress}
            onDownloadPress={onDownloadPress}
            isFavorite={isFavorite}
            idFavorito={idFavorito}
        />
    );
}
