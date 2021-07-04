import { SyntheticEvent, useCallback, useRef, useState } from 'react';

import Image from 'next/image';

import { FaChevronLeft, FaChevronRight, FaPlay, FaStop } from 'react-icons/fa';
import styles from '../styles/Home.module.scss';

type KudoProps = {
  [key: string]:  HTMLAudioElement;
}

export default function Home() {
  const [kudos, setKudos] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [kudoIndex, setKudoIndex] = useState(0);
  const textareaRef = useRef(null);
  const kudoAudioRef = useRef<KudoProps>(null);

  const handleFormSubmit = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    if (textareaRef.current) {
      if (textareaRef.current.value.trim() !== '') {
        setKudos(
          textareaRef.current.value.split('\n').map((item: string) => {
            const regex = item.match(/\/([^\/]+)\/?$/)
            if (regex && regex.length > 0) {
              const kudoID = regex[1];
              const kudoAudio = new Audio(`${process.env.NEXT_PUBLIC_API_URL}/audio/${kudoID}`);

              kudoAudio.currentTime = 0;
          
              kudoAudio.addEventListener('play', () => {
                setIsPlaying(true);
              });
          
              kudoAudio.addEventListener('ended', () => {
                setIsPlaying(false);
              });
          
              kudoAudio.addEventListener('pause', () => {
                setIsPlaying(false);
              })

              if (!kudoAudioRef.current) {
                kudoAudioRef.current = {}
              }

              kudoAudioRef.current[kudoID] = kudoAudio;

              return kudoID
            } else {
              return null
            }
          }).filter((item: string) => item)
        )
      }
    }    
  }, []);

  const handlePlayButton = useCallback((kudo: string) => {    
    if (kudoAudioRef.current) {
      if (kudoAudioRef.current[kudo].currentTime === 0) {
        kudoAudioRef.current[kudo].play();
      } else {
        kudoAudioRef.current[kudo].pause();
        kudoAudioRef.current[kudo].currentTime = 0;
      }
    }
  }, []); 

  const handlePriorKudo = useCallback(() => {
    if (kudoIndex > 0) {
      kudoAudioRef.current[kudos[kudoIndex]].pause();
      kudoAudioRef.current[kudos[kudoIndex]].currentTime = 0;
      setKudoIndex(kudoIndex - 1)
    }
  }, [kudoIndex, kudos]);

  const handleNextKudo = useCallback(() => {
    if (kudoIndex < kudos.length - 1) {
      kudoAudioRef.current[kudos[kudoIndex]].pause();
      kudoAudioRef.current[kudos[kudoIndex]].currentTime = 0;      
      setKudoIndex(kudoIndex + 1)
    }
  }, [kudoIndex, kudos]);

  if (kudos.length <= 0) {
    return (
      <div className={styles.container}>
        <small>Digite um kudo por linha. Ex: https://kudobox.co/q/qfgp9OJVgVNvCLaEuiTA_k/</small>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <textarea rows={20} autoFocus ref={textareaRef}/>

          <button type="submit">
            Carregar kudos
          </button>
        </form>
      </div>
    )
  }

  return (    
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.counter}>
          <span>{ kudoIndex + 1}</span>/<small>{kudos.length}</small>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.body}>
            <Image src={`${process.env.NEXT_PUBLIC_API_URL}/image/${kudos[kudoIndex]}`} width={669} height={477} alt="Kudo" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNU2HelFAAE4QIpvhr6VwAAAABJRU5ErkJggg==" />
            <footer className={styles.footer}>
              <button disabled={kudoIndex <= 0} onClick={handlePriorKudo}>
                <FaChevronLeft size={32} />
              </button>
              <button className="principal" onClick={() => handlePlayButton(kudos[kudoIndex])}>
                {!isPlaying && <FaPlay size={32} />}
                {isPlaying && <FaStop size={32} />}
              </button>
              <button disabled={kudoIndex >= kudos.length -1} onClick={handleNextKudo}>
                <FaChevronRight size={32} />
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
