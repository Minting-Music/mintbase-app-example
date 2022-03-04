enum AnimationType {
    audio = 'audio/mpeg',
    video = 'video/mp4',
}

export interface ThingMetadata {
    // Animation type enum should be used for animation type when all possible types are known
    animation_type: string;
    animation_url: string | null;
    media: string;
    title: string;
    description: string;
    tags: [];
    external_url: string;
    category: string;
    __typename?: string;
}

interface List {
    autotransfer: boolean;
    offer: {price: string};
    price: string;
    __typename?: string;
}

export interface Token {
    id: string;
    list: List;
    txId?: string;
    __typename?: string;
}

export interface Thing {
    thing_id: string;
    storeId: string;
    store: {name: string};
    metadata
    : ThingMetadata;
    tokens: Token[];
    allTokens: []
    __typename?: string;
}

export interface ProductMeta {
    id: string;
    media: string;
    animation_url: string;
    title: string;
    animation_type: string;
    thing: {
        id: string;
        tokens: Token[];
    };
    typename?: string;
}

