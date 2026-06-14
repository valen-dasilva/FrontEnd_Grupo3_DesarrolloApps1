import React from 'react';
import { ItineraryInfoCard } from '../Explorar/CardItinerarioInfo';

type Props = {
    title?: string;
    imageUrl?: string;
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
