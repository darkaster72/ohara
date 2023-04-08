import Image from "next/image";

type GalleryProductType = {
  images: string[];
};

const Gallery = ({ images }: GalleryProductType) => {
  const featImage = images[0] ?? "";

  return (
    <section className="product-gallery">
      <div className="product-gallery__thumbs">
        {images.map((image) => (
          <div key={image} className="product-gallery__thumb">
            <Image src={image} alt="" width="600" height="530" />
          </div>
        ))}
      </div>

      <div className="product-gallery__image">
        <Image src={featImage} alt="" width="600" height="530" />
      </div>
    </section>
  );
};

export default Gallery;
