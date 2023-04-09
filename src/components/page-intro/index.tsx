import Link from "next/link";
import SwiperCore, { EffectFade, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([EffectFade, Navigation]);

const slides = [
  { imgUrl: "/images/slide-1.jpg", title: "Get the knowledge." },
  { imgUrl: "/images/slide-2.jpg", title: "For you bookworms." },
];

const PageIntro = () => {
  return (
    <section className="page-intro">
      <Swiper navigation effect="fade" className="swiper-wrapper">
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div
              className="page-intro__slide"
              style={{ backgroundImage: `url(${slide.imgUrl})` }}
            >
              <div className="container">
                <div className="page-intro__slide__content">
                  <h2>{slide.title}</h2>
                  <Link href="/products" className="btn-shop">
                    <>
                      <i className="icon-right"></i>Shop now
                    </>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="shop-data">
        <div className="container">
          <ul className="shop-data__items">
            <li>
              <i className="icon-shipping"></i>
              <div className="data-item__content">
                <h4>Free Shipping</h4>
                <p>On purchases over 500</p>
              </div>
            </li>

            <li>
              <i className="icon-shipping"></i>
              <div className="data-item__content">
                <h4>99% Satisfied Customers</h4>
                <p>Our clients' opinions speak for themselves</p>
              </div>
            </li>

            <li>
              <i className="icon-cash"></i>
              <div className="data-item__content">
                <h4>Originality Guaranteed</h4>
                <p>30 days warranty for each product from our store</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PageIntro;
