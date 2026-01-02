
import { PlaceHolderImages } from '@/lib/placeholder-images';

export type Product = {
  id: number;
  name: string;
  farmerId: string;
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
    farmerId: 'farmer_rakesh_kumar',
    farmerName: 'Rakesh Kumar',
    location: 'Punjab, India',
    pricePerKg: 30,
    quantityKg: 500,
    ...findImage('wheat-field'),
  },
  {
    id: 2,
    name: 'Fresh Tomatoes',
    farmerId: 'farmer_sunita_devi',
    farmerName: 'Sunita Devi',
    location: 'Maharashtra, India',
    pricePerKg: 45,
    quantityKg: 200,
    ...findImage('fresh-tomatoes'),
  },
  {
    id: 3,
    name: 'Himalayan Potatoes',
    farmerId: 'farmer_tenzing_norgay',
    farmerName: 'Tenzing Norgay',
    location: 'Himachal Pradesh, India',
    pricePerKg: 25,
    quantityKg: 1000,
    ...findImage('potato-harvest'),
  },
  {
    id: 4,
    name: 'Nasik Onions',
    farmerId: 'farmer_anil_patil',
    farmerName: 'Anil Patil',
    location: 'Maharashtra, India',
    pricePerKg: 35,
    quantityKg: 800,
    ...findImage('onion-basket'),
  },
  {
    id: 5,
    name: 'Basmati Rice',
    farmerId: 'farmer_gurpreet_singh',
    farmerName: 'Gurpreet Singh',
    location: 'Haryana, India',
    pricePerKg: 80,
    quantityKg: 1200,
    ...findImage('basmati-rice'),
  },
  {
    id: 6,
    name: 'Alphonso Mangoes',
    farmerId: 'farmer_devika_rao',
    farmerName: 'Devika Rao',
    location: 'Ratnagiri, India',
    pricePerKg: 250,
    quantityKg: 300,
    ...findImage('alphonso-mangoes'),
  },
  {
    id: 7,
    name: 'Sugarcane',
    farmerId: 'farmer_rajendra_prasad',
    farmerName: 'Rajendra Prasad',
    location: 'Uttar Pradesh, India',
    pricePerKg: 5,
    quantityKg: 5000,
    ...findImage('sugarcane-field'),
  },
  {
    id: 8,
    name: 'Indian Cotton',
    farmerId: 'farmer_lakshmi_bai',
    farmerName: 'Lakshmi Bai',
    location: 'Gujarat, India',
    pricePerKg: 60,
    quantityKg: 1500,
    ...findImage('cotton-plant'),
  },
  {
    id: 9,
    name: 'Green Cardamom',
    farmerId: 'farmer_muthu_kumar',
    farmerName: 'Muthu Kumar',
    location: 'Kerala, India',
    pricePerKg: 1200,
    quantityKg: 50,
    ...findImage('cardamom-pods'),
  },
  {
    id: 10,
    name: 'Darjeeling Tea',
    farmerId: 'farmer_priya_thapa',
    farmerName: 'Priya Thapa',
    location: 'West Bengal, India',
    pricePerKg: 1500,
    quantityKg: 100,
    ...findImage('darjeeling-tea'),
  },
  {
    id: 11,
    name: 'Kerala Coconuts',
    farmerId: 'farmer_joseph_km',
    farmerName: 'Joseph K.M.',
    location: 'Kerala, India',
    pricePerKg: 40,
    quantityKg: 600,
    ...findImage('coconuts'),
  },
  {
    id: 12,
    name: 'Golden Jute',
    farmerId: 'farmer_aarav_biswas',
    farmerName: 'Aarav Biswas',
    location: 'West Bengal, India',
    pricePerKg: 55,
    quantityKg: 2000,
    ...findImage('jute-fiber'),
  }
];
