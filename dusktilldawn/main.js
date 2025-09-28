// 計算 D+ 天數
function calculateDays() {
  const startDate = new Date("2024-01-22");
  const today = new Date();
  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

window.onload = () => {
  const openingText = document.getElementById("openingText");
  const background = document.querySelector(".background");
  const mainPanel = document.getElementById("mainPanel");
  const bgMusic = document.getElementById("bgMusic");

  // 顯示 D+ 天數
  openingText.textContent = `D+${calculateDays()}`;

  // 1秒後開始淡出文字 + 背景清晰
  setTimeout(() => {
    openingText.style.opacity = 0;
    background.style.filter = "blur(0px)";
  }, 1000);

  // 文字完全消失後，主面板漸漸淡入 + 播放音樂
  setTimeout(() => {
    openingText.style.display = "none";
    mainPanel.classList.remove("hidden");
    mainPanel.style.opacity = 1; // 觸發 CSS transition
    mainPanel.style.transform = "translate(-50%, -50%) scale(1)";

    // 播放背景音樂
    if(bgMusic) {
      bgMusic.loop = true;
      bgMusic.volume = 0.5;
      bgMusic.play().catch(e => {
        console.log("自動播放失敗，需要使用者互動才能播放", e);
      });
    }
  }, 2000);
};

// 三個右上點內容
const tabContents = [
  "firstPage", // 第一頁文章索引

  // 第二頁畫廊
  `<h2>pic.</h2>
<div class="gallery-scroll">
  <div class="gallery">
    <img src="images/1.jpg" alt="">
    <img src="images/2.jpg" alt="">
    <img src="images/3.jpg" alt="">
    <video src="images/4.mp4" controls muted loop></video>
    <video src="images/5.mp4" controls muted loop></video>
    <img src="images/6.jpg" alt="">
    <img src="images/7.jpg" alt="">
    <img src="images/8.jpg" alt="">
    <img src="images/9.jpg" alt="">
    <img src="images/10.jpg" alt="">
    <img src="images/11.jpg" alt="">
  </div>
</div>
<div class="article-nav">
  <span class="homeBtn">Home</span>
</div>`,

  // 第三頁委託
  `<h2>comission</h2>
<div class="comission-scroll">
  <div class="comission">
    <div class="carousel">
      <div class="carousel-inner">
        <img src="comission/1.jpg" alt="" class="blur">
        <img src="comission/2.jpg" alt="" class="blur">
      </div>
      <div class="carousel-dots">
        <span class="dot active" data-index="0"></span>
        <span class="dot" data-index="1"></span>
      </div>
    </div>
    <img src="comission/3.jpg" alt="">
    <img src="comission/4.jpg" alt="">
    <img src="comission/5.jpg" alt="" class="blur">
    <img src="comission/6.jpg" alt="">
    <img src="comission/7.jpg" alt="">
  </div>
</div>
<div class="article-nav">
  <span class="homeBtn">Home</span>
</div>`
];

const tabs = document.querySelectorAll(".tab-dot");
const mainPanel = document.getElementById("mainPanel");
const tabContentDiv = document.getElementById("tabContent");

// 第一頁文章檔案對應
const articleFiles = [
  "articles/spring-love.html",
  "articles/translucent.html",
  "articles/dawn.html",
  "articles/brother.html",
  "articles/first-snow.html",
  "articles/four-seasons.html"
];

// 切換 tab
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    // 切換 active 樣式
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // 整個面板淡出
    mainPanel.style.opacity = 0;
    mainPanel.style.transform = "translate(-50%, -50%) scale(0.95)";

    setTimeout(() => {
      const index = tab.dataset.index;

      if (index == 0) {
        tabContentDiv.innerHTML = `
          <div class="first-page">
            <ul class="article-index" id="articleIndex">
              <li data-article="0">春天戀愛季</li>
              <li data-article="1">半透明侵占</li>
              <li data-article="2">黎明將至</li>
              <li data-article="3">小黎哥哥</li>
              <li data-article="4">初雪</li>
              <li data-article="5">四季予你</li>
            </ul>

            <div class="article-content" id="articleContent">
              <div class="article-content-scroll">
                <p>請選擇左側文章索引查看內容</p>
              </div>
            </div>
          </div>

          <div class="article-nav">
            <span class="homeBtn">Home</span>｜<span id="prevBtn">Prev.</span>｜<span id="nextBtn">Next</span>
          </div>
        `;
        initFirstPageArticles();
      } else {
        tabContentDiv.innerHTML = tabContents[index];
      }

      // 綁定 Home 按鈕
      bindHomeButtons();

      // 面板淡入
      mainPanel.style.opacity = 1;
      mainPanel.style.transform = "translate(-50%, -50%) scale(1)";
    }, 500);
  });
});

// 第一頁索引文章功能初始化
function initFirstPageArticles() {
  const articleIndex = document.getElementById("articleIndex");
  const articleContent = document.getElementById("articleContent");
  const articleItems = articleIndex.querySelectorAll("li");

  articleItems.forEach((item, idx) => {
    item.addEventListener("click", () => {
      articleItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      articleContent.style.opacity = 0;

      fetch(articleFiles[idx])
        .then(res => res.text())
        .then(data => {
          setTimeout(() => {
            articleContent.innerHTML = data;
            articleContent.style.opacity = 1;
          }, 300);
        });
    });
  });

  // Prev / Next
  document.getElementById("prevBtn").addEventListener("click", () => {
    let current = Array.from(articleItems).findIndex(i => i.classList.contains("active"));
    if (current > 0) articleItems[current - 1].click();
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    let current = Array.from(articleItems).findIndex(i => i.classList.contains("active"));
    if (current < articleItems.length - 1) articleItems[current + 1].click();
  });

  // 綁定 Home
  bindHomeButtons();
}

// 統一綁定所有 Home 按鈕（淡入淡出效果）
function bindHomeButtons() {
  document.querySelectorAll(".homeBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      mainPanel.style.opacity = 0;
      mainPanel.style.transform = "translate(-50%, -50%) scale(0.95)";

      setTimeout(() => {
        tabContentDiv.innerHTML = `
          <h2>夏黎(蘋果果)</h2>
          <h4>85000178118</h4>
          <p>幸福幸福，請降臨在小黎手心</p>
          <p>黎語冬｜黎思雪｜黎暮霜｜黎栩霽</p>
        `;
        
                // 重置三個 tab 的選取狀態
        tabs.forEach(t => t.classList.remove("active"));

        mainPanel.style.opacity = 1;
        mainPanel.style.transform = "translate(-50%, -50%) scale(1)";
      }, 500);
    });
  });
}


function initComissionCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const inner = carousel.querySelector(".carousel-inner");
  const dots = carousel.querySelectorAll(".dot");

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = dot.dataset.index;
      inner.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(d => d.classList.remove("active"));
      dot.classList.add("active");
    });
  });
}

// 在切換到第三頁時初始化輪播
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    setTimeout(() => {
      const index = tab.dataset.index;
      if (index == 2) { // 第三頁 comission
        initComissionCarousel();
      }
    }, 500);
  });
});

function initComissionCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const inner = carousel.querySelector(".carousel-inner");
  const dots = carousel.querySelectorAll(".dot");

  // 點擊 dots 切換
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = dot.dataset.index;
      inner.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(d => d.classList.remove("active"));
      dot.classList.add("active");
    });
  });

  // 🔹只選取 comission 區塊裡有 blur class 的圖片
  const blurredImages = document.querySelectorAll(".comission img.blur");

  // 點擊圖片解除模糊
  blurredImages.forEach(img => {
    img.addEventListener("click", () => {
      img.classList.add("revealed");
    });
  });
}


// 可在第一次點擊 tab 或 Home 按鈕時嘗試播放音樂
document.body.addEventListener('click', () => {
  if(bgMusic && bgMusic.paused){
    bgMusic.play().catch(e => console.log(e));
  }
}, { once: true });
