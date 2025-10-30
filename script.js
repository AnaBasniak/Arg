/* CONFIGURAÇÕES */
const WHATSAPP_LINK = 'https://chat.whatsapp.com/BfByCXi4S4sC8KOFqkNwk0?mode=wwt';
const STORAGE_KEY = 'arg_block_v3';
const MAX_DENIES = 2; // Número máximo de vezes que o usuário pode negar antes de ser bloqueado

/* IMPORTANTE: nome exato do arquivo GIF (se for usar o recurso de fundo) */
const BG_FILENAME_RAW = "151 Sem Título.gif";
/* Codifica o nome do arquivo para uso em URL (lida com espaços e acentos) */
const BG_FILENAME = encodeURI(BG_FILENAME_RAW);

/* Funções de Ajuda (helpers) */
const $ = id => document.getElementById(id);

/**
 * Esconde todas as telas e mostra a tela com o ID especificado.
  * @param {string} id - O ID da tela a ser exibida.
   */
   const show = id => {
     document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
       const el = $(id); if(el) el.classList.add('active');
       };

       /* Define a imagem de fundo final usando o nome do arquivo codificado */
       function setFinalBackground(){
         const el = $('final-bg');
           if(!el) return;
             // usa CSS background-image com o nome codificado
               el.style.backgroundImage = `url("${BG_FILENAME}")`;
                 el.style.backgroundRepeat = 'no-repeat';
                   el.style.backgroundSize = 'cover';
                     el.style.backgroundPosition = 'center center';
                     }

                     /* Carrega o estado do localStorage */
                     let state = { denies:0, blocked:false };
                     try { 
                         const raw = localStorage.getItem(STORAGE_KEY); 
                             if(raw) state = JSON.parse(raw); 
                             } catch(e){ 
                                 console.error('Erro ao carregar o estado do localStorage:', e);
                                     state={denies:0,blocked:false}; 
                                     }

                                     /* Inicialização */
                                     document.addEventListener('DOMContentLoaded', ()=>{
                                       setFinalBackground();        // Define o fundo GIF imediatamente (evita flash)
                                         show('screen-home');         // Apenas a tela inicial visível ao carregar
                                           if(state.blocked) enterBlockedVisuals(); else startHomeGlitchCycle();
                                             attachHandlers();
                                             });

                                             /* Persiste o estado no localStorage */
                                             function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

                                             /* Define os manipuladores de eventos dos botões */
                                             function attachHandlers(){
                                               // Botão SIM -> Abre a tela de confirmação
                                                 $('btn-yes').addEventListener('click', ()=>{ if(state.blocked) return; show('screen-confirm'); });
                                                   
                                                     // Botão Cancelar -> Volta para a tela inicial
                                                       $('confirm-cancel').addEventListener('click', ()=> show('screen-home'));
                                                         
                                                           // Botão Confirmar -> Redireciona para o link do WhatsApp
                                                             $('confirm-join').addEventListener('click', ()=> { 
                                                                 if(state.blocked) return; 
                                                                     window.location.href = WHATSAPP_LINK; 
                                                                       });

                                                                         // Botão NÃO -> Gerencia o estado de negações e o bloqueio
                                                                           $('btn-no').addEventListener('click', ()=>{
                                                                               if(state.blocked) return;
                                                                                   state.denies = Math.min(state.denies + 1, 99); saveState();
                                                                                       
                                                                                           if(state.denies === 1){
                                                                                                 show('screen-glitch1');
                                                                                                       runReadableGlitch('gl1-text', 5000, ()=> show('screen-home'));
                                                                                                           } 
                                                                                                               else if(state.denies >= MAX_DENIES){
                                                                                                                     show('screen-glitch2');
                                                                                                                           setTimeout(()=> { 
                                                                                                                                   state.blocked = true; 
                                                                                                                                           saveState(); 
                                                                                                                                                   enterBlockedVisuals(); 
                                                                                                                                                           show('screen-home'); 
                                                                                                                                                                 }, 5000);
                                                                                                                                                                     }
                                                                                                                                                                       });
                                                                                                                                                                       }

                                                                                                                                                                       /* Efeito de micro embaralhamento de caracteres para o glitch */
                                                                                                                                                                       function microScramble(element, dur = 220){
                                                                                                                                                                         if(!element) return;
                                                                                                                                                                           const original = element.getAttribute('data-text') || element.textContent || '';
                                                                                                                                                                             const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&*()[]{}<>/\\';
                                                                                                                                                                               let scrambled = '';
                                                                                                                                                                                 for(let i=0;i<original.length;i++){
                                                                                                                                                                                     if(original[i]===' ' || Math.random()>0.14) scrambled += original[i];
                                                                                                                                                                                         else scrambled += chars.charAt(Math.floor(Math.random()*chars.length));
                                                                                                                                                                                           }
                                                                                                                                                                                             element.textContent = scrambled;
                                                                                                                                                                                               element.setAttribute('data-text', scrambled);
                                                                                                                                                                                                 setTimeout(()=> { element.textContent = original; element.setAttribute('data-text', original); }, dur);
                                                                                                                                                                                                 }

                                                                                                                                                                                                 /* Roda o efeito glitch em um elemento por um tempo total */
                                                                                                                                                                                                 function runReadableGlitch(id, totalMs = 5000, cb){
                                                                                                                                                                                                   const el = $(id); if(!el){ if(cb) cb(); return; }
                                                                                                                                                                                                     const interval = 360;
                                                                                                                                                                                                       const iterations = Math.max(2, Math.ceil(totalMs / interval));
                                                                                                                                                                                                         let i=0;
                                                                                                                                                                                                           const t = setInterval(()=>{
                                                                                                                                                                                                               el.classList.add('jitter'); microScramble(el, 220);
                                                                                                                                                                                                                   setTimeout(()=> el.classList.remove('jitter'), 180);
                                                                                                                                                                                                                       i++; 
                                                                                                                                                                                                                           if(i>=iterations){ 
                                                                                                                                                                                                                                 clearInterval(t); 
                                                                                                                                                                                                                                       const orig = el.getAttribute('data-text'); 
                                                                                                                                                                                                                                             if(orig){el.textContent = orig; el.setAttribute('data-text', orig);} 
                                                                                                                                                                                                                                                   if(cb) cb(); 
                                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                                         }, interval);
                                                                                                                                                                                                                                                         }

                                                                                                                                                                                                                                                         /* Ciclo de glitch na tela inicial */
                                                                                                                                                                                                                                                         let homeGlitchTimer = null;
                                                                                                                                                                                                                                                         function startHomeGlitchCycle(){
                                                                                                                                                                                                                                                           const el = $('home-text');
                                                                                                                                                                                                                                                             if(!el) return;
                                                                                                                                                                                                                                                               if(homeGlitchTimer) clearInterval(homeGlitchTimer);
                                                                                                                                                                                                                                                                 homeGlitchTimer = setInterval(()=>{ el.classList.add('jitter'); microScramble(el,180); setTimeout(()=> el.classList.remove('jitter'),160); }, 3600 + Math.random()*2200);
                                                                                                                                                                                                                                                                 }

                                                                                                                                                                                                                                                                 /* Aplica visuais de bloqueio */
                                                                                                                                                                                                                                                                 function enterBlockedVisuals(){
                                                                                                                                                                                                                                                                   const homeText = $('home-text');
                                                                                                                                                                                                                                                                     if(homeText){ 
                                                                                                                                                                                                                                                                         homeText.textContent = 'Você quer jogar um jogo?'; 
                                                                                                                                                                                                                                                                             homeText.style.color = 'var(--danger)'; 
                                                                                                                                                                                                                                                                                 homeText.classList.remove('jitter'); 
                                                                                                                                                                                                                                                                                   }
                                                                                                                                                                                                                                                                                     const yes=$('btn-yes'), no=$('btn-no'); 
                                                                                                                                                                                                                                                                                       if(yes){ yes.disabled=true; yes.style.opacity='.36'; } 
                                                                                                                                                                                                                                                                                         if(no){ no.disabled=true; no.style.opacity='.36'; }
                                                                                                                                                                                                                                                                                           document.body.classList.add('blocked-body');
                                                                                                                                                                                                                                                                                             if(homeGlitchTimer) clearInterval(homeGlitchTimer);
                                                                                                                                                                                                                                                                                             }

                                                                                                                                                                                                                                                                                             /* Utilitário para desenvolvedores: reseta o estado clicando no rodapé */
                                                                                                                                                                                                                                                                                             document.querySelector('footer').addEventListener('click', ()=>{ 
                                                                                                                                                                                                                                                                                               if(confirm('Resetar estado do site (organizadores)?')){ 
                                                                                                                                                                                                                                                                                                   localStorage.removeItem(STORAGE_KEY); 
                                                                                                                                                                                                                                                                                                       location.reload(); 
                                                                                                                                                                                                                                                                                                         }
                                                                                                                                                                                                                                                                                                         });