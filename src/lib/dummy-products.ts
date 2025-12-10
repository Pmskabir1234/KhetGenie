import { PlaceHolderImages } from '@/lib/placeholder-images';

export type Product = {
  id: number;
  name: string;
  farmerName: string;
  location: string;
  pricePerKg: number;
  quantityKg: number;
  imageUrl: string;
  imageHint: string;
};

const findImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (!image) {
        return {
            imageUrl: "https://picsum.photos/seed/error/600/400",
            imageHint: "image missing"
        };
    }
    return {
        imageUrl: image.imageUrl,
        imageHint: image.imageHint,
    }
}

export const dummyProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Wheat',
    farmerName: 'Rakesh Kumar',
    location: 'Punjab, India',
    pricePerKg: 30,
    quantityKg: 500,
    ...findImage('wheat-field'),
  },
  {
    id: 2,
    name: 'Fresh Tomatoes',
    farmerName: 'Sunita Devi',
    location: 'Maharashtra, India',
    pricePerKg: 45,
    quantityKg: 200,
    ...findImage('fresh-tomatoes'),
  },
  {
    id: 3,
    name: 'Himalayan Potatoes',
    farmerName: 'Tenzing Norgay',
    location: 'Himachal Pradesh, India',
    pricePerKg: 25,
    quantityKg: 1000,
    ...findImage('potato-harvest'),
  },
    {
    id: 4,
    name: 'Nasik Onions',
    farmerName: 'Anil Patil',
    location: 'Maharashtra, India',
    pricePerKg: 35,
    quantityKg: 800,
    ...findImage('onion-basket'),
    },
];
