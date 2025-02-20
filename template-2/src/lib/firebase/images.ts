import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

interface GeneratedImage {
  userId: string;
  imageUrl: string;
  prompt: string;
  createdAt: Date;
}

export const saveGeneratedImage = async (
  userId: string,
  imageUrl: string,
  prompt: string
) => {
  try {
    const imageData: GeneratedImage = {
      userId,
      imageUrl,
      prompt,
      createdAt: new Date(),
    };

    await addDoc(collection(db, 'generated_images'), imageData);
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};

export const getUserImages = async (userId: string) => {
  try {
    const imagesRef = collection(db, 'generated_images');
    const q = query(
      imagesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching user images:', error);
    throw error;
  }
}; 