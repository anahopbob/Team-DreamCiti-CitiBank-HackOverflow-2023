import numpy as np 
from PIL import Image
from tensorflow.keras.preprocessing import image


from keras.applications.vgg16 import VGG16

class ImageEmbedding:


    @staticmethod
    def load_image(image_path):
        """
            -----------------------------------------------------
            Process the image provided. 
            - Resize the image 
            -----------------------------------------------------
            return resized image
        """
        input_image = Image.open(image_path)
        resized_image = input_image.resize((224, 224))

        return resized_image
    
    @staticmethod
    def get_image_embeddings(image_path):
    
        """
        -----------------------------------------------------
        convert image into 3d array and add additional dimension for model input
        -----------------------------------------------------
        return embeddings of the given image
        """

        vgg16 = VGG16(weights='imagenet', include_top=False, 
                pooling='max', input_shape=(224, 224, 3))
        for model_layer in vgg16.layers:
            model_layer.trainable = False

        image_input = ImageEmbedding.load_image(image_path)
        image_array = np.expand_dims(image.img_to_array(image_input), axis = 0)
        image_embedding = vgg16.predict(image_array)

        return image_embedding.tolist()
    
