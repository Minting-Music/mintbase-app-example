import styles from '../public/modules/player.module.css'

function Player({ src, thumbnail, size }: { src?: string, thumbnail: string, size: string }) {

    
    function getStyle() {
           if (size === 'big') return styles['big-player']
           else return styles['small-player']
    }

    return (
        <div className=''>
            <div className="">
                <video id="video" className={getStyle()} poster={thumbnail} controls controlsList="nodownload" autoPlay={size=='big'} loop muted>
                    <source src={src} />
                </video>
            </div>
            {/* <style jsx>
                {`
                    video[poster] {
                        height: 17em;
                        object-fit: contain
                    }
                `}  
            </style> */}
        </div>
    );
}

export default Player;