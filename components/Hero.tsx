import client from '../public/data/client.json'
const Hero = () => {
  return (
    <>
      <div
        className="w-full py-24 px-6 bg-cover bg-no-repeat bg-top h-full  relative object-cover mt-16"
        style={{
          backgroundImage:
            "url('images/coverArt.jpg')",
        }}
      >
        <div className="container w-full text-center mx-auto my-auto">
          <h1 className="fontFamily text-gradient hero-neon text-3xl">
            {client.HeroTitle}
          </h1>
          <p className="fontFamily text-white py-3 text-2xl">
            {client.HeroQuote}
          </p>

        </div>
      </div>
    </>
  )
}

export default Hero;