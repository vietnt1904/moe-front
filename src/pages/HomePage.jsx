import { Carousel } from "@mantine/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const displayDefault = 4;
  const seeMore = 4;

    const [visibleProducts, setVisibleProducts] = useState(displayDefault); // Show 10 products initially

    const data = [
        { id: 1, title: "Product 1", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 2, title: "Product 2", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 3, title: "Product 3", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 4, title: "Product 4", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 5, title: "Product 5", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 6, title: "Product 6", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 7, title: "Product 7", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 8, title: "Product 8", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 9, title: "Product 9", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 10, title: "Product 10", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
        { id: 11, title: "Product 11", image: "https://upload-os-bbs.hoyolab.com/upload/2023/12/19/17138284/898721050c498b27389d23fa43f53fd8_5145071566460184172.jpeg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70" },
      ];

      const [products] = useState(data);

  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const autoplayItem = useRef(Autoplay({ delay: 1500 }));
  const autoplayItem2 = useRef(Autoplay({ delay: 1500 }));

  const handleToggle = (e) => {
    e.preventDefault(); // Prevent page reload
    if (visibleProducts < products.length) {
      setVisibleProducts(visibleProducts + seeMore); // Show all products (20 in this case)
    } else {
      setVisibleProducts(displayDefault); // Show only 10 products
    }
  };

  return (
    <div className="w-11/12 items-center mx-auto my-12">
        {/* Carousel */}
      <div className="w-full rounded-3xl overflow-hidden shadow-[4px_4px_4px_4px_rgba(0,0,0,0.4)] mb-12">
        <Carousel
          style={{ borderRadius: "20px" }}
          withIndicators
          height={500}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.play}
          onMouseLeave={autoplay.current.reset}
          loop
          onClick={autoplay.current.reset}
        >
          <Carousel.Slide>
            <img
              className="w-full h-full object-cover"
              src="https://upanh123.com/wp-content/uploads/2019/01/hinh-nen-phong-canh-anime-3.jpg"
              alt="Slide 1"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
              className="w-full h-full object-cover"
              src="https://i.pinimg.com/736x/c2/e9/02/c2e902e031e1d9d932411dd0b8ab5eef.jpg"
              alt="Slide 2"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
              className="w-full h-full object-cover"
              src="https://teky.edu.vn/blog/wp-content/uploads/2022/03/nhieu-nguoi-thich-tai-hinh-nen-nay.jpg"
              alt="Slide 3"
            />
          </Carousel.Slide>
        </Carousel>
      </div>

      {/* Trending */}
      <div>
        <div className="my-6 flex items-center">
            <p className="text-2xl font-bold">Trending</p>
            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="trending" className="w-6 h-6 mx-6" />
        </div>
        <Carousel
          height={"auto"}
          slideSize={{ base: "50%", md: "33.333333%", lg: "25%" }}
          slideGap={{ base: "md", sm: "md" }}
          plugins={[autoplayItem.current]}
          onMouseEnter={autoplayItem.current.play}
          onMouseLeave={autoplayItem.current.reset}
          loop
          onClick={autoplayItem.current.reset}
          align={"start"}
        >
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
        </Carousel>
      </div>

      {/* đề cử */}
      <div>
        <div className="my-6 flex items-center">
            <p className="text-2xl font-bold">Đề cử</p>
            <img src="https://png.pngtree.com/png-vector/20221227/ourmid/pngtree-orange-cartoon-cute-flame-png-image_6510196.png" alt="trending" className="w-6 h-6 mx-2" />
        </div>
        <Carousel
        className="w-5/6 mx-auto"
          height={"auto"}
          slideSize={{ base: "50%", md: "33.333333%"}}
          slideGap={{ base: "md", sm: "md" }}
          plugins={[autoplayItem2.current]}
          onMouseEnter={autoplayItem2.current.play}
          onMouseLeave={autoplayItem2.current.reset}
          loop
          onClick={autoplayItem2.current.reset}
          align={"start"}
        >
          <Carousel.Slide>
            <img
                className="rounded-xl h-auto"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
                className="rounded-xl"
              src="https://ocafe.net/wp-content/uploads/2024/10/anh-nen-may-tinh-4k-1.jpg"
              alt="ảnh slide"
            />
          </Carousel.Slide>
        </Carousel>
      </div>

      {/* hiển thị xem thêm */}
      <div>
      <div className="my-6 flex items-center">
            <p className="text-2xl font-bold">Hiển thị xem thêm</p>
            <img src="https://png.pngtree.com/png-vector/20221227/ourmid/pngtree-orange-cartoon-cute-flame-png-image_6510196.png" alt="trending" className="w-6 h-6 mx-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {products.slice(0, visibleProducts).map((product) => (
          <div key={product.id} className="rounded-lg overflow-hidden">
            {/* Link to product detail page */}
            <Link to={`/products/${product.id}`} className="flex-1">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover"
              />
            </Link>
          </div>
        ))}
        </div>
        <div className="flex justify-center mt-8">
            <Button onClick={handleToggle} color="yellow">{visibleProducts >= products.length ? "Ẩn bớt" : "Xem thêm"}</Button>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
