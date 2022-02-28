import client from '../public/data/client.json'
const Hero = () => {
  return (
    <>
      <div
        className="w-full py-24 px-6 bg-cover bg-no-repeat bg-center h-full relative z-10 object-contain mt-20 md:mt-24"
        style={{
          backgroundImage:
            "url('images/coverArt.jpg')",
        }}
      >
        <div className="container max-w-4xl mx-auto my-auto">
          <h1 className="fontFamily text-gradient heroH1">
            {client.HeroTitle}
          </h1>
          <p className="fontFamily heroP">
            {client.HeroQuote}
          </p>

        </div>
      </div>
    </>
  )
}

export default Hero
