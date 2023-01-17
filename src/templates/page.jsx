/* eslint-disable react/no-danger */
import React, { useEffect }  from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import SEO from "../components/seo";
import SearchInputBox from "../components/SearchInputBox";
import MobileView from "../components/MobileView";
import LeftNav from "../components/LeftNav";
import SideBar from "../components/SideBar";
import EditDoc from "../components/EditButton";
import Footer from "../components/Footer";

import 'prismjs/themes/prism-tomorrow.css';
import './page.scss';
import {environment} from "../environment";

export default ({ data, pageContext }) => {

    const prev = pageContext.prev
        ? {
            url: `${pageContext.prev.fields.slug}`,
            title: pageContext.prev.frontmatter.title
        }
        : null;

    const next = pageContext.next
        ? {
            url: `${pageContext.next.fields.slug}`,
            title: pageContext.next.frontmatter.title
        }
        : null;

    const post = data.markdownRemark;
    if(environment.isStaging()) {
        post.frontmatter.noindex = true;
    }

    let contextualLinks;
    if (post.frontmatter.contextual_links) {
        contextualLinks = <SideBar links={post.frontmatter.contextual_links} />;
    }

    const copyToClipBoard = (e) => {
      const str = e.target.parentNode.innerText;
      e.target.className += ' copied '
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-99999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setTimeout(() => {
        e.target.classList.remove('copied');
      }, 300);
    };

    useEffect(() => {
      // finding all code tags in markdown file dynamically which requires copy to clipboard logic.
      const preTags = document.getElementsByTagName('pre');
      const codeTags = document.getElementsByTagName('code');
      if (preTags.length > 0) {
        Object.keys(preTags).map(function(keyName, keyIndex) {
          const originalText = preTags[keyName].innerHTML;
          const icon = document.createElement("i");
          icon.className = "copytoclipboard";
          if(preTags[keyName]) {
              preTags[keyName].parentNode.appendChild(icon);
              return preTags[keyName].innerHTML = originalText;
          }
        })
      }
      else {
        Object.keys(codeTags).map(function(keyName, keyIndex) {
            const originalText = codeTags[keyName].innerHTML;
            const icon = document.createElement("i");
            icon.className = "copytoclipboard";
            if (preTags[keyName]) {
                preTags[keyName].parentNode.appendChild(icon);
                return codeTags[keyName].innerHTML = originalText;
            }
        })
      }
      // adding eventlistners to all copytoclipboard icons which generated dynamically for markdown file code tags.
      const copyIcon = document.getElementsByClassName('copytoclipboard');
      Object.keys(copyIcon).map(function(keyName, keyIndex) {
        return copyIcon[keyName].addEventListener('click', copyToClipBoard);
      })
      // when user click any link tag from leftnav prevent scroll position after page content rendered/rerendered/load time.
      if (window.location.href.indexOf('/#') === -1) {
        setTimeout(() => {
          const headerOffset = document.getElementById('root_header').offsetHeight;
          const leftNavCurrentUrl = document.querySelector('.isTablet .leftNav .currentUrl');
          const scrollBarAdjustment = 50;
          // when page content changed move scroll bar to starting of the page content title position.
          document.querySelector('body').scrollTo(0, 0);
          if (leftNavCurrentUrl)
            document.querySelector('.isTablet .leftNav').scrollTo({
              top: (leftNavCurrentUrl.offsetTop - (headerOffset + scrollBarAdjustment)),
              behavior: 'smooth'
            });
        }, 300);
      }
    });

    return (
        <Layout>
            <SEO
              title={post.frontmatter.page_title || post.frontmatter.title}
              slug={post.fields.slug}
              canonical={post.frontmatter.canonical}
              metadesc={post.frontmatter.metadesc}
              keywords={post.frontmatter.keywords}
              social_share_summary={post.frontmatter.social_share_summary}
              social_share_desc={post.frontmatter.social_share_desc}
              social_share_image={post.frontmatter.social_share_image}
              noindex={post.frontmatter.noindex || false}
            />
            <header id="root_header" className="header-block flex items-stretch">
                <div className="container flex">
                    <div className="logo-block flex max-w-sm w-1/4">
                    <svg width="156" height="26" viewBox="0 0 156 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-10 my-6">
                        <path d="M34.7403 10.1388L34.5569 11.2181C34.5324 11.3157 34.4774 11.4011 34.3918 11.4743C34.3062 11.5474 34.2145 11.584 34.1167 11.584H32.4661L31.4573 17.3285C31.3962 17.6334 31.3656 17.8469 31.3656 17.9688C31.3656 18.1396 31.4115 18.2463 31.5032 18.289C31.5949 18.3317 31.7569 18.353 31.9892 18.353H32.9613C33.0468 18.353 33.1233 18.3652 33.1905 18.3896C33.2578 18.414 33.2914 18.475 33.2914 18.5725V18.6274L33.0896 19.78C33.053 19.9629 32.9185 20.0727 32.6861 20.1093C32.4538 20.1459 32.2368 20.1764 32.0351 20.2008C31.8333 20.2252 31.6285 20.2374 31.4207 20.2374C30.6137 20.2374 29.9962 20.0849 29.5683 19.78C29.1403 19.4751 28.9264 18.9567 28.9264 18.225C28.9264 18.0908 28.9355 17.9505 28.9539 17.8042C28.9722 17.6578 28.9936 17.4993 29.0181 17.3285L30.0268 11.584L28.3395 11.3279C28.1438 11.3035 28.046 11.1998 28.046 11.0169V10.962L28.1927 10.1388C28.2172 10.0412 28.2692 9.95582 28.3486 9.88264C28.4281 9.80946 28.5168 9.77287 28.6146 9.77287H30.3386L30.6137 8.27272C30.6381 8.17515 30.6901 8.09587 30.7696 8.03489C30.849 7.97391 30.9377 7.93122 31.0355 7.90683L32.7962 7.61412H32.8696C33.0407 7.61412 33.1263 7.6873 33.1263 7.83365V7.88854L32.7779 9.77287H34.4285C34.6363 9.77287 34.7403 9.87654 34.7403 10.0839V10.1388ZM43.9048 13.3952C43.9048 13.5659 43.8956 13.7397 43.8773 13.9166C43.859 14.0934 43.8376 14.2672 43.8131 14.438L43.6664 15.3161C43.6052 15.621 43.4585 15.7735 43.2262 15.7735H37.2472C37.2228 15.9076 37.2014 16.0327 37.183 16.1485C37.1647 16.2644 37.1555 16.3894 37.1555 16.5236C37.1555 17.0236 37.2961 17.423 37.5774 17.7219C37.8586 18.0207 38.3415 18.1701 39.0262 18.1701C39.6987 18.1701 40.3345 18.1457 40.9337 18.0969C41.5328 18.0481 42.028 18.0054 42.4192 17.9688H42.4926C42.566 17.9688 42.6301 17.981 42.6852 18.0054C42.7402 18.0298 42.7677 18.0847 42.7677 18.1701V18.2432L42.5476 19.4507C42.5232 19.597 42.4834 19.7068 42.4284 19.78C42.3734 19.8532 42.2603 19.902 42.0891 19.9263C41.7834 19.9751 41.4961 20.0209 41.2271 20.0636C40.9581 20.1062 40.683 20.1398 40.4018 20.1642C40.1206 20.1886 39.821 20.2069 39.5031 20.2191C39.1852 20.2313 38.8184 20.2374 38.4027 20.2374C37.9992 20.2374 37.5835 20.1764 37.1555 20.0544C36.7276 19.9324 36.3394 19.7282 35.9909 19.4415C35.6424 19.1549 35.3551 18.7768 35.1289 18.3073C34.9027 17.8377 34.7896 17.2553 34.7896 16.5601C34.7896 16.3894 34.7957 16.2126 34.808 16.0296C34.8202 15.8467 34.8446 15.6576 34.8813 15.4625L35.0831 14.3282C35.2298 13.4745 35.456 12.7488 35.7617 12.1512C36.0673 11.5535 36.4402 11.0687 36.8804 10.6967C37.3206 10.3248 37.828 10.0564 38.4027 9.89179C38.9773 9.72714 39.6131 9.64481 40.3101 9.64481C40.9214 9.64481 41.4533 9.73933 41.9057 9.92838C42.3581 10.1174 42.731 10.3796 43.0245 10.715C43.3179 11.0504 43.538 11.4468 43.6847 11.9042C43.8314 12.3616 43.9048 12.8586 43.9048 13.3952ZM41.5205 13.3586C41.5205 12.822 41.3861 12.4164 41.1171 12.142C40.8481 11.8676 40.4568 11.7304 39.9433 11.7304C39.2097 11.7304 38.6594 11.9499 38.2926 12.389C37.9258 12.8281 37.6813 13.383 37.559 14.0538H41.4472C41.4716 13.9318 41.49 13.816 41.5022 13.7062C41.5144 13.5964 41.5205 13.4806 41.5205 13.3586ZM52.9043 10.4498L52.7209 11.4926C52.6842 11.7243 52.568 11.8402 52.3724 11.8402H52.299C52.1768 11.8158 52.0056 11.7914 51.7855 11.767C51.5654 11.7426 51.3239 11.7212 51.0611 11.7029C50.7982 11.6847 50.52 11.6664 50.2266 11.6481C49.9331 11.6298 49.658 11.6206 49.4012 11.6206C49.2545 11.6206 49.0986 11.6298 48.9336 11.6481C48.7685 11.6664 48.6157 11.7029 48.4751 11.7578C48.3344 11.8127 48.2183 11.895 48.1266 12.0048C48.0349 12.1146 47.989 12.267 47.989 12.4622C47.989 12.7061 48.1724 12.9561 48.5392 13.2122L50.6851 14.6758C51.2353 15.0539 51.599 15.432 51.7763 15.8101C51.9536 16.1882 52.0423 16.5784 52.0423 16.9809C52.0423 17.5542 51.9322 18.0451 51.7121 18.4536C51.4921 18.8622 51.1986 19.2007 50.8318 19.469C50.465 19.7373 50.037 19.9324 49.548 20.0544C49.0589 20.1764 48.5392 20.2374 47.989 20.2374C47.8423 20.2374 47.6375 20.2343 47.3746 20.2282C47.1117 20.2221 46.8305 20.2038 46.531 20.1733C46.2314 20.1428 45.9196 20.1032 45.5956 20.0544C45.2716 20.0056 44.969 19.9446 44.6878 19.8715C44.5043 19.8105 44.4126 19.7007 44.4126 19.5422V19.4507L44.6144 18.353C44.6388 18.2554 44.6847 18.1823 44.7519 18.1335C44.8192 18.0847 44.9017 18.0603 44.9995 18.0603H45.0546C45.2746 18.0847 45.5253 18.1091 45.8065 18.1335C46.0877 18.1579 46.3659 18.1792 46.641 18.1975C46.9161 18.2158 47.1759 18.231 47.4205 18.2432C47.665 18.2554 47.8545 18.2615 47.989 18.2615C48.4414 18.2615 48.8174 18.1975 49.117 18.0695C49.4165 17.9414 49.5663 17.6639 49.5663 17.237C49.5663 17.0907 49.5205 16.9474 49.4288 16.8071C49.3371 16.6669 49.1812 16.5175 48.9611 16.3589L46.7235 14.8222C46.369 14.5782 46.0816 14.2642 45.8615 13.88C45.6415 13.4958 45.5314 13.0842 45.5314 12.6451C45.5314 12.0353 45.6506 11.5383 45.889 11.1541C46.1275 10.7699 46.4331 10.465 46.8061 10.2394C47.179 10.0138 47.5947 9.85825 48.0532 9.77287C48.5117 9.6875 48.9611 9.64481 49.4012 9.64481C49.9515 9.64481 50.5017 9.6753 51.0519 9.73629C51.6021 9.79727 52.134 9.89484 52.6475 10.029C52.8187 10.0778 52.9043 10.1875 52.9043 10.3583V10.4498ZM60.7116 10.1388L60.5282 11.2181C60.5037 11.3157 60.4487 11.4011 60.3631 11.4743C60.2775 11.5474 60.1858 11.584 60.088 11.584H58.4374L57.4287 17.3285C57.3675 17.6334 57.337 17.8469 57.337 17.9688C57.337 18.1396 57.3828 18.2463 57.4745 18.289C57.5662 18.3317 57.7282 18.353 57.9605 18.353H58.9326C59.0182 18.353 59.0946 18.3652 59.1618 18.3896C59.2291 18.414 59.2627 18.475 59.2627 18.5725V18.6274L59.061 19.78C59.0243 19.9629 58.8898 20.0727 58.6575 20.1093C58.4252 20.1459 58.2081 20.1764 58.0064 20.2008C57.8046 20.2252 57.5998 20.2374 57.392 20.2374C56.585 20.2374 55.9675 20.0849 55.5396 19.78C55.1117 19.4751 54.8977 18.9567 54.8977 18.225C54.8977 18.0908 54.9069 17.9505 54.9252 17.8042C54.9435 17.6578 54.9649 17.4993 54.9894 17.3285L55.9981 11.584L54.3108 11.3279C54.1152 11.3035 54.0173 11.1998 54.0173 11.0169V10.962L54.1641 10.1388C54.1885 10.0412 54.2405 9.95582 54.32 9.88264C54.3994 9.80946 54.4881 9.77287 54.5859 9.77287H56.3099L56.585 8.27272C56.6095 8.17515 56.6614 8.09587 56.7409 8.03489C56.8204 7.97391 56.909 7.93122 57.0068 7.90683L58.7675 7.61412H58.8409C59.0121 7.61412 59.0976 7.6873 59.0976 7.83365V7.88854L58.7492 9.77287H60.3998C60.6077 9.77287 60.7116 9.87654 60.7116 10.0839V10.1388ZM68.6657 10.4498L68.4823 11.4926C68.4456 11.7243 68.3294 11.8402 68.1338 11.8402H68.0604C67.9382 11.8158 67.767 11.7914 67.5469 11.767C67.3268 11.7426 67.0853 11.7212 66.8224 11.7029C66.5596 11.6847 66.2814 11.6664 65.988 11.6481C65.6945 11.6298 65.4194 11.6206 65.1626 11.6206C65.0159 11.6206 64.86 11.6298 64.695 11.6481C64.5299 11.6664 64.3771 11.7029 64.2364 11.7578C64.0958 11.8127 63.9797 11.895 63.888 12.0048C63.7963 12.1146 63.7504 12.267 63.7504 12.4622C63.7504 12.7061 63.9338 12.9561 64.3006 13.2122L66.4465 14.6758C66.9967 15.0539 67.3604 15.432 67.5377 15.8101C67.715 16.1882 67.8037 16.5784 67.8037 16.9809C67.8037 17.5542 67.6936 18.0451 67.4735 18.4536C67.2534 18.8622 66.96 19.2007 66.5932 19.469C66.2264 19.7373 65.7984 19.9324 65.3094 20.0544C64.8203 20.1764 64.3006 20.2374 63.7504 20.2374C63.6037 20.2374 63.3989 20.2343 63.136 20.2282C62.8731 20.2221 62.5919 20.2038 62.2924 20.1733C61.9928 20.1428 61.681 20.1032 61.357 20.0544C61.033 20.0056 60.7304 19.9446 60.4491 19.8715C60.2657 19.8105 60.174 19.7007 60.174 19.5422V19.4507L60.3758 18.353C60.4002 18.2554 60.4461 18.1823 60.5133 18.1335C60.5806 18.0847 60.6631 18.0603 60.7609 18.0603H60.816C61.036 18.0847 61.2867 18.1091 61.5679 18.1335C61.8491 18.1579 62.1273 18.1792 62.4024 18.1975C62.6775 18.2158 62.9373 18.231 63.1819 18.2432C63.4264 18.2554 63.6159 18.2615 63.7504 18.2615C64.2028 18.2615 64.5788 18.1975 64.8784 18.0695C65.1779 17.9414 65.3277 17.6639 65.3277 17.237C65.3277 17.0907 65.2818 16.9474 65.1901 16.8071C65.0984 16.6669 64.9426 16.5175 64.7225 16.3589L62.4849 14.8222C62.1304 14.5782 61.843 14.2642 61.6229 13.88C61.4028 13.4958 61.2928 13.0842 61.2928 12.6451C61.2928 12.0353 61.412 11.5383 61.6504 11.1541C61.8889 10.7699 62.1945 10.465 62.5675 10.2394C62.9404 10.0138 63.3561 9.85825 63.8146 9.77287C64.2731 9.6875 64.7225 9.64481 65.1626 9.64481C65.7129 9.64481 66.2631 9.6753 66.8133 9.73629C67.3635 9.79727 67.8954 9.89484 68.4089 10.029C68.5801 10.0778 68.6657 10.1875 68.6657 10.3583V10.4498ZM73.942 6.42497L73.6486 8.03489C73.6241 8.13246 73.5722 8.21784 73.4927 8.29102C73.4132 8.36419 73.3246 8.40078 73.2267 8.40078H71.4477C71.3499 8.40078 71.2704 8.37334 71.2093 8.31846C71.1482 8.26357 71.1176 8.18735 71.1176 8.08978V8.03489L71.411 6.42497C71.4355 6.3274 71.4905 6.24203 71.5761 6.16885C71.6617 6.09567 71.7534 6.05908 71.8512 6.05908H73.6302C73.8381 6.05908 73.942 6.16275 73.942 6.37009V6.42497ZM73.2267 10.1388L71.5394 19.7068C71.515 19.8044 71.4599 19.8928 71.3744 19.9721C71.2888 20.0514 71.1971 20.091 71.0993 20.091H69.4119C69.3141 20.091 69.2408 20.0605 69.1918 19.9995C69.1429 19.9385 69.1185 19.8654 69.1185 19.78V19.7068L70.8058 10.1388C70.8303 10.0412 70.8822 9.95582 70.9617 9.88264C71.0412 9.80946 71.1298 9.77287 71.2276 9.77287H72.915C73.1228 9.77287 73.2267 9.87654 73.2267 10.0839V10.1388ZM83.4734 10.4864C83.4734 10.5108 83.4703 10.5321 83.4642 10.5504C83.4581 10.5687 83.455 10.59 83.455 10.6144L81.786 20.0544C81.6638 20.7252 81.4987 21.2954 81.2908 21.7649C81.083 22.2345 80.7956 22.6156 80.4288 22.9084C80.062 23.2011 79.6005 23.4145 79.0441 23.5487C78.4878 23.6828 77.8123 23.7499 77.0175 23.7499C76.1249 23.7499 75.3975 23.695 74.835 23.5853C74.2726 23.4755 73.8813 23.384 73.6612 23.3108C73.5634 23.2742 73.487 23.2346 73.432 23.1919C73.3769 23.1492 73.3494 23.0791 73.3494 22.9815C73.3494 22.9693 73.3525 22.9541 73.3586 22.9358C73.3647 22.9175 73.3678 22.8962 73.3678 22.8718L73.5512 21.9022C73.5879 21.6948 73.7224 21.5911 73.9547 21.5911H73.9913C74.1992 21.6155 74.4499 21.6399 74.7433 21.6643C75.0368 21.6887 75.3424 21.7101 75.6603 21.7284C75.9782 21.7467 76.287 21.7649 76.5865 21.7832C76.8861 21.8015 77.1398 21.8107 77.3476 21.8107C78.0446 21.8107 78.5367 21.6918 78.8241 21.4539C79.1114 21.2161 79.2917 20.7923 79.3651 20.1825L79.3834 20.0361C79.1022 20.0971 78.821 20.1428 78.5398 20.1733C78.2586 20.2038 77.9835 20.2191 77.7145 20.2191C77.1887 20.2191 76.6935 20.155 76.2289 20.027C75.7643 19.8989 75.3608 19.6946 75.0184 19.4141C74.6761 19.1336 74.4071 18.7768 74.2114 18.3439C74.0158 17.9109 73.918 17.3834 73.918 16.7614C73.918 16.5906 73.9241 16.4138 73.9363 16.2308C73.9486 16.0479 73.973 15.8528 74.0097 15.6454L74.2481 14.2367C74.3948 13.383 74.6088 12.6634 74.89 12.078C75.1713 11.4926 75.5289 11.02 75.9629 10.6602C76.397 10.3004 76.9044 10.0412 77.4852 9.88264C78.066 9.72409 78.7232 9.64481 79.4568 9.64481C80.0437 9.64481 80.6673 9.69055 81.3275 9.78202C81.9878 9.8735 82.5624 9.98631 83.0515 10.1205C83.186 10.1571 83.2899 10.1997 83.3633 10.2485C83.4367 10.2973 83.4734 10.3766 83.4734 10.4864ZM80.8323 11.7853C80.6612 11.7487 80.4136 11.7121 80.0895 11.6755C79.7655 11.6389 79.4385 11.6206 79.1083 11.6206C78.3503 11.6206 77.7909 11.8371 77.4302 12.2701C77.0695 12.7031 76.8158 13.3586 76.669 14.2367L76.4306 15.6454C76.3939 15.865 76.3634 16.0692 76.3389 16.2583C76.3145 16.4473 76.3022 16.6272 76.3022 16.798C76.3022 17.2858 76.4184 17.6517 76.6507 17.8957C76.883 18.1396 77.311 18.2615 77.9345 18.2615C78.1546 18.2615 78.4389 18.2463 78.7874 18.2158C79.1358 18.1853 79.4446 18.1518 79.7136 18.1152L80.8323 11.7853ZM98.3051 12.3158C98.3051 12.6695 98.2684 13.0598 98.195 13.4867L97.0946 19.7068C97.0702 19.8044 97.0151 19.8928 96.9295 19.9721C96.8439 20.0514 96.7523 20.091 96.6544 20.091H94.9671C94.8693 20.091 94.7959 20.0605 94.747 19.9995C94.6981 19.9385 94.6737 19.8654 94.6737 19.78V19.7068L95.7741 13.4867C95.7985 13.3159 95.8199 13.1604 95.8383 13.0202C95.8566 12.8799 95.8658 12.7549 95.8658 12.6451C95.8658 12.2914 95.7802 12.0475 95.609 11.9133C95.4379 11.7792 95.1566 11.7121 94.7654 11.7121C94.5942 11.7121 94.3344 11.7456 93.9859 11.8127C93.6374 11.8798 93.2798 11.9987 92.913 12.1695C92.9008 12.3768 92.8916 12.5902 92.8855 12.8098C92.8794 13.0293 92.858 13.2549 92.8213 13.4867L91.7209 19.7068C91.6964 19.8044 91.6414 19.8928 91.5558 19.9721C91.4702 20.0514 91.3785 20.091 91.2807 20.091H89.5934C89.4956 20.091 89.4222 20.0605 89.3733 19.9995C89.3244 19.9385 89.2999 19.8654 89.2999 19.78V19.7068L90.4003 13.4867C90.437 13.3037 90.4615 13.1391 90.4737 12.9927C90.4859 12.8464 90.4921 12.7122 90.4921 12.5902C90.4921 12.2487 90.4126 12.017 90.2536 11.895C90.0947 11.7731 89.8257 11.7121 89.4466 11.7121C89.0798 11.7121 88.4807 11.9133 87.6493 12.3158L86.3471 19.7068C86.3227 19.8044 86.2676 19.8928 86.182 19.9721C86.0965 20.0514 86.0048 20.091 85.9069 20.091H84.2196C84.1218 20.091 84.0484 20.0605 83.9995 19.9995C83.9506 19.9385 83.9262 19.8654 83.9262 19.78V19.7068L85.6135 10.1388C85.6379 10.0412 85.6899 9.95582 85.7694 9.88264C85.8489 9.80946 85.9375 9.77287 86.0353 9.77287H87.6309C87.8388 9.77287 87.9427 9.87654 87.9427 10.0839V10.1388L87.8694 10.523C88.2973 10.279 88.7191 10.0717 89.1349 9.90094C89.5506 9.73019 90.0335 9.64481 90.5838 9.64481C91.1095 9.64481 91.5283 9.73323 91.8401 9.91008C92.1519 10.0869 92.3872 10.2973 92.5462 10.5412C93.0108 10.2363 93.506 10.0107 94.0318 9.86435C94.5575 9.71799 95.1383 9.64481 95.7741 9.64481C96.6544 9.64481 97.2963 9.88264 97.6998 10.3583C98.1033 10.834 98.3051 11.4865 98.3051 12.3158ZM108.863 10.4681C108.863 10.529 108.857 10.5778 108.845 10.6144L107.25 19.7251C107.225 19.8227 107.17 19.908 107.084 19.9812C106.999 20.0544 106.907 20.091 106.809 20.091H105.342C105.146 20.091 105.049 19.9873 105.049 19.78V19.7251L105.122 19.1946C104.608 19.5848 104.119 19.8562 103.655 20.0087C103.19 20.1611 102.732 20.2374 102.279 20.2374C101.864 20.2374 101.472 20.1672 101.105 20.027C100.739 19.8867 100.418 19.6763 100.143 19.3958C99.8675 19.1153 99.6535 18.7707 99.5007 18.3622C99.3478 17.9536 99.2714 17.4749 99.2714 16.926C99.2714 16.7553 99.2775 16.5754 99.2898 16.3864C99.302 16.1973 99.3264 16.0113 99.3631 15.8284C99.3876 15.6454 99.4182 15.4625 99.4548 15.2795C99.4793 15.121 99.5099 14.9502 99.5465 14.7673C99.5832 14.5843 99.6138 14.4075 99.6382 14.2367C99.895 12.7976 100.457 11.6725 101.326 10.8614C102.194 10.0503 103.367 9.64481 104.847 9.64481C105.434 9.64481 106.042 9.6875 106.672 9.77287C107.301 9.85825 107.891 9.97411 108.442 10.1205C108.576 10.1571 108.68 10.1967 108.753 10.2394C108.827 10.2821 108.863 10.3583 108.863 10.4681ZM106.222 11.7487C106.051 11.7121 105.804 11.6816 105.48 11.6572C105.156 11.6328 104.829 11.6206 104.498 11.6206C104.107 11.6206 103.771 11.6877 103.49 11.8219C103.209 11.956 102.973 12.139 102.784 12.3707C102.594 12.6024 102.441 12.8768 102.325 13.194C102.209 13.5111 102.12 13.8587 102.059 14.2367L101.729 16.1211C101.705 16.2552 101.686 16.3864 101.674 16.5144C101.662 16.6425 101.656 16.7614 101.656 16.8712C101.656 17.3956 101.778 17.7584 102.022 17.9597C102.267 18.1609 102.567 18.2615 102.921 18.2615C103.276 18.2615 103.643 18.1945 104.022 18.0603C104.401 17.9261 104.798 17.7371 105.214 17.4932L106.222 11.7487Z" fill="#2D4A60"/>
                        <path d="M25.5298 9.76322C25.2845 9.39565 24.937 9.18224 24.5053 9.12618C24.3028 9.10134 24.0914 9.06694 23.8914 9.03509C23.6353 8.99623 23.3721 8.95482 23.1128 8.92679C22.4211 8.85672 21.9969 8.56941 21.7408 8.00627C21.5652 7.6215 21.5441 7.27814 21.6769 6.93924L21.7759 6.68378C21.9471 6.23977 22.126 5.77728 22.3157 5.32945C22.4984 4.89562 22.4843 4.46881 22.2742 4.05601C21.8884 3.29985 21.2816 2.77493 20.4748 2.49846C20.0181 2.34111 19.5653 2.40035 19.1552 2.66982C18.9591 2.79595 18.7554 2.91826 18.5561 3.03739C18.2782 3.20557 17.9908 3.38011 17.7206 3.56931C17.5315 3.70182 17.2927 3.77189 17.0327 3.77189C16.3837 3.77189 15.7552 3.34508 15.6013 2.80296C15.5208 2.51247 15.4224 2.2258 15.3273 1.94933C15.2436 1.7149 15.1625 1.47028 15.0884 1.23203C14.9376 0.724947 14.6042 0.374577 14.0958 0.1892C13.9489 0.136963 13.7975 0.0949184 13.6499 0.0598814C13.5905 0.0426814 13.5241 0.0248444 13.4641 0.0070074L13.4328 0H12.5941L12.5622 0.0108296C12.5449 0.0146518 12.5309 0.0216592 12.5136 0.0280296C12.4926 0.035037 12.4708 0.0420444 12.4472 0.0458666C11.5913 0.200029 11.079 0.633851 10.8887 1.38237C10.805 1.71172 10.6862 2.04361 10.5738 2.36213C10.5138 2.53413 10.4537 2.70549 10.3981 2.87686C10.2295 3.38776 9.62272 3.79037 9.01528 3.79037C8.77384 3.79037 8.54517 3.72411 8.35994 3.59416C8.01949 3.36291 7.66563 3.14632 7.32135 2.93992C7.15656 2.83863 6.99177 2.74053 6.83017 2.63924C6.5108 2.43985 6.16013 2.37997 5.8133 2.46788C4.87052 2.69785 4.18005 3.27182 3.75529 4.17131C3.5873 4.53188 3.57964 4.92684 3.74124 5.31862C3.81469 5.49699 3.88495 5.67599 3.95522 5.85755C4.06061 6.13402 4.16919 6.4175 4.29183 6.69398C4.54413 7.26094 4.51666 7.76165 4.19666 8.26172C3.97949 8.60509 3.69525 8.80766 3.3267 8.87774C2.79655 8.97966 2.22871 9.06694 1.63597 9.13701C1.13392 9.19307 0.74429 9.44151 0.474743 9.87534C0.110025 10.4633 -0.0445489 11.1316 0.0110211 11.8559C0.0640362 12.535 0.39043 13.021 0.979983 13.3013C1.19396 13.4032 1.4041 13.5256 1.61169 13.6409C1.83908 13.7702 2.07158 13.9033 2.31686 14.0186C2.66816 14.1792 2.93068 14.5505 3.015 15.0016C3.1025 15.4711 2.9837 15.9469 2.69882 16.2368C2.30217 16.6496 1.91318 17.0942 1.54463 17.5561C1.376 17.7625 1.25656 18.0218 1.21057 18.2702C1.03939 19.2461 1.86016 20.6916 2.77994 21.0343C3.00733 21.1184 3.2954 21.1426 3.55856 21.1037C4.05294 21.0267 4.56585 20.9254 5.12346 20.789C5.69577 20.6489 6.13778 20.7674 6.5619 21.1846C6.88063 21.4993 7.02498 21.8389 7.01412 22.2619C7.00071 22.8046 6.98666 23.3856 6.96174 23.9736C6.94067 24.4176 7.09524 24.803 7.41461 25.1145C7.92368 25.6114 8.56242 25.9057 9.31932 25.986C9.40427 25.9968 9.48411 26 9.56523 26C10.1407 26 10.607 25.7547 10.9411 25.2719C11.0739 25.0859 11.2183 24.9113 11.3722 24.7259C11.5306 24.5335 11.6916 24.338 11.8391 24.1277C12.0806 23.771 12.5264 23.5576 13.0246 23.5576C13.5126 23.5576 13.9546 23.7678 14.2037 24.1144C14.4075 24.401 14.6317 24.6775 14.8463 24.9438C14.9792 25.105 15.1127 25.2693 15.2391 25.4369C15.4844 25.7554 15.8178 25.9408 16.1934 25.9758C17.1055 26.0599 17.9231 25.7796 18.6174 25.1464C18.9502 24.8419 19.1086 24.4501 19.0837 23.978C19.0703 23.7716 19.0664 23.5544 19.0626 23.348C19.0562 23.0747 19.0485 22.7951 19.0275 22.5186C18.9789 21.8675 19.1827 21.3987 19.663 21.0451C19.9817 20.8139 20.2941 20.7298 20.6345 20.7859C21.2484 20.8871 21.7964 20.9993 22.3118 21.1292C22.8446 21.2585 23.3364 21.1362 23.7637 20.7578C24.3009 20.289 24.6515 19.6908 24.8023 18.9837C24.9287 18.3925 24.7882 17.8816 24.3845 17.465C24.2261 17.3006 24.0722 17.1223 23.9247 16.9509C23.7771 16.7764 23.6232 16.5973 23.4609 16.4292C23.0196 15.975 22.8969 15.5055 23.0617 14.9111C23.1741 14.4945 23.3805 14.2148 23.7037 14.0326C24.2332 13.7313 24.7275 13.4619 25.2194 13.207C25.6122 13.0006 25.8645 12.6821 25.9661 12.2591C26.1864 11.3692 26.0389 10.5296 25.5298 9.76322Z" fill="#03A973"/>
                        <path d="M12.9727 9.95604L12.9764 9.90356L13.0132 8.97563C13.0064 8.93339 13.023 8.76828 13.023 8.74332C13.0266 8.248 13.053 8.2832 13.094 7.34054C13.0964 7.26695 13.067 7.19335 13.0101 7.14344C12.9562 7.09416 12.8815 7.08072 12.8111 7.098C12.418 7.19975 11.9299 7.30854 11.3617 7.42118C11.2539 7.4423 11.1829 7.53701 11.1731 7.64644C11.1057 8.51486 11.1155 8.31135 11.0831 8.71836L10.9918 9.8754C10.9918 9.8754 10.9918 9.8786 10.9918 9.88244L10.9343 10.9755L10.8112 13.3516L10.7671 14.1951C10.7096 15.2817 10.6796 15.8967 10.6734 16.0791C10.6661 16.259 10.663 16.3882 10.663 16.4663C10.663 17.0499 10.7634 17.528 10.9625 17.8825C11.1676 18.2441 11.4633 18.5116 11.8436 18.6735C12.2037 18.8322 12.6776 18.909 13.2532 18.909C13.4785 18.909 13.7241 18.8949 13.9764 18.87C14.2317 18.8418 14.5752 18.7753 15.002 18.6729C15.0926 18.6479 15.1637 18.5711 15.1771 18.4758C15.2108 18.2435 15.2482 17.9555 15.2788 17.6777C15.3186 17.3405 15.359 16.9923 15.3964 16.8266C15.4166 16.7351 15.3829 16.6397 15.3125 16.584C15.2414 16.5277 15.1471 16.5175 15.0675 16.5597C14.6536 16.778 14.4215 16.8656 14.0449 16.9392C13.9133 16.9674 13.7988 16.9674 13.6745 16.9674H13.6145C13.4393 16.9674 13.2067 16.9079 13.0187 16.8125C12.8472 16.7242 12.8068 16.6928 12.7762 16.5457C12.7223 16.2679 12.7223 16.2084 12.7223 15.8782V15.7342L12.7327 15.3259L12.8674 12.3239L12.9727 9.95604Z" fill="white"/>
                        <path d="M17.7153 10.0824L17.3115 9.20661C17.2445 9.06442 17.124 8.95146 16.9791 8.90029C16.8342 8.84514 16.6751 8.85245 16.5334 8.92222L13.5476 10.3967L13.5514 10.3422L11.4035 11.4552L10.1411 12.0791L9.65676 11.0246C9.59236 10.8824 9.47256 10.7728 9.32765 10.7176C9.18273 10.6631 9.02365 10.6704 8.88196 10.7402L8.03308 11.1555C7.74325 11.2977 7.61959 11.6558 7.75742 11.9549L8.8929 14.43C8.95989 14.5722 9.07711 14.6852 9.22202 14.7363C9.28643 14.7622 9.35341 14.7729 9.41653 14.7729C9.50477 14.7729 9.59043 14.7549 9.66771 14.7144L11.274 13.9223L13.4368 12.8552L17.4416 10.8804C17.7295 10.7395 17.8531 10.3814 17.7153 10.0824Z" fill="white"/>
                        <path d="M115.052 8.184H119.732C121.016 8.184 122.12 8.424 123.044 8.904C123.968 9.372 124.67 10.056 125.15 10.956C125.642 11.844 125.888 12.9 125.888 14.124C125.888 15.564 125.618 16.8 125.078 17.832C124.55 18.864 123.77 19.65 122.738 20.19C121.718 20.73 120.494 21 119.066 21H114.062L115.052 8.184ZM118.886 19.11C121.994 19.11 123.548 17.442 123.548 14.106C123.548 12.786 123.2 11.784 122.504 11.1C121.82 10.416 120.806 10.074 119.462 10.074H117.23L116.51 19.11H118.886ZM131.967 21.144C131.043 21.144 130.239 20.964 129.555 20.604C128.871 20.232 128.343 19.71 127.971 19.038C127.599 18.366 127.413 17.58 127.413 16.68C127.413 15.672 127.605 14.79 127.989 14.034C128.385 13.278 128.937 12.696 129.645 12.288C130.353 11.88 131.175 11.676 132.111 11.676C133.023 11.676 133.821 11.862 134.505 12.234C135.189 12.606 135.711 13.128 136.071 13.8C136.443 14.472 136.629 15.252 136.629 16.14C136.629 17.16 136.437 18.048 136.053 18.804C135.669 19.56 135.123 20.142 134.415 20.55C133.719 20.946 132.903 21.144 131.967 21.144ZM131.967 19.398C132.759 19.398 133.359 19.098 133.767 18.498C134.187 17.886 134.397 17.076 134.397 16.068C134.397 15.216 134.199 14.562 133.803 14.106C133.419 13.65 132.861 13.422 132.129 13.422C131.325 13.422 130.713 13.728 130.293 14.34C129.873 14.94 129.663 15.738 129.663 16.734C129.663 18.51 130.431 19.398 131.967 19.398ZM142.62 21.144C141.696 21.144 140.892 20.964 140.208 20.604C139.524 20.232 138.996 19.716 138.624 19.056C138.252 18.384 138.066 17.604 138.066 16.716C138.066 15.684 138.264 14.79 138.66 14.034C139.068 13.278 139.638 12.696 140.37 12.288C141.114 11.88 141.978 11.676 142.962 11.676C144.366 11.676 145.518 12.06 146.418 12.828L145.644 14.412C144.792 13.764 143.928 13.44 143.052 13.44C142.212 13.44 141.558 13.728 141.09 14.304C140.622 14.868 140.388 15.666 140.388 16.698C140.388 17.55 140.598 18.21 141.018 18.678C141.438 19.146 142.026 19.38 142.782 19.38C143.25 19.38 143.688 19.302 144.096 19.146C144.504 18.99 144.918 18.75 145.338 18.426L145.842 19.992C145.446 20.352 144.96 20.634 144.384 20.838C143.82 21.042 143.232 21.144 142.62 21.144ZM150.718 21.144C149.242 21.144 147.916 20.76 146.74 19.992L147.514 18.426C148.534 19.134 149.62 19.488 150.772 19.488C151.936 19.488 152.518 19.152 152.518 18.48C152.518 18.168 152.362 17.934 152.05 17.778C151.75 17.61 151.264 17.424 150.592 17.22C149.956 17.04 149.428 16.86 149.008 16.68C148.588 16.5 148.228 16.242 147.928 15.906C147.64 15.558 147.496 15.108 147.496 14.556C147.496 13.692 147.844 12.996 148.54 12.468C149.236 11.94 150.16 11.676 151.312 11.676C151.984 11.676 152.632 11.778 153.256 11.982C153.88 12.186 154.402 12.468 154.822 12.828L154.066 14.358C153.166 13.674 152.236 13.332 151.276 13.332C150.712 13.332 150.28 13.422 149.98 13.602C149.68 13.782 149.53 14.046 149.53 14.394C149.53 14.718 149.68 14.964 149.98 15.132C150.292 15.288 150.79 15.468 151.474 15.672C152.134 15.864 152.668 16.05 153.076 16.23C153.484 16.398 153.832 16.656 154.12 17.004C154.42 17.352 154.57 17.802 154.57 18.354C154.57 19.23 154.222 19.914 153.526 20.406C152.83 20.898 151.894 21.144 150.718 21.144Z" fill="#03A973"/>
                    </svg>
                    </div>
                    <div className="primary-nav flex-auto flex items-center">
                        <div className="search-block relative flex items-center justify-between w-2/5 pl-9 pr-9">
                            <div className="search-block-child">
                              <SearchInputBox></SearchInputBox>
                            </div>
                            <a id={'signup-btn'} target={'_blank'} className="border border-green-600 px-4 py-1.5 text-green-600 rounded" href='https://testsigma.com/signup'>Get started for free</a>
                        </div>
                        <nav className="flex w-4/5">
                            <a className="border-b-2 border-green-500 btn btn-ghost btn-sm pr-2 rounded-btn text-green-600">
                            Docs
                            </a>
                            <a className="btn btn-ghost btn-sm rounded-btn ml-10" href={'/tutorials/'}>
                            Tutorials
                            </a>
                            <a className="btn btn-ghost btn-sm rounded-btn ml-10" target={'_blank'} href={'https://github.com/Testsigmahq/testsigma/'}>
                            GitHub
                            </a>
                            <a className="btn btn-ghost btn-sm rounded-btn ml-10" href={'https://discord.com/invite/5caWS7R6QX'}>
                                Discord
                            </a>
                            <a className="btn btn-ghost btn-sm rounded-btn ml-10" href={'https://testsigma.com/products'}>
                            Enterprise
                            </a>
                            <a className="btn btn-ghost btn-sm rounded-btn ml-10" href={'https://testsigma.com/'}>
                            Testsigma Cloud
                            </a>
                        </nav>
                    </div>
                </div>
            </header>
            <hr/>
            {/*<SubNav></SubNav>*/}
            <div className="w-full">
                <div className="flex items-stretch">
                    <MobileView></MobileView>
                    <nav className="isTablet w-1/4 max-w-sm bg-gray-50">
                        <LeftNav />
                    </nav>
                    <div className="flex-auto w-4/5">
                        <div className="flex items-stretch w-full">
                            <main className="doc-page w-4/5">
                                <div className="px-20 py-14">
                                    <h1>{post.frontmatter.title}</h1>
                                    <span dangerouslySetInnerHTML={{ __html: post.html }} />
                                </div>
                            </main>
                            <aside className="isGithubEdit w-1/5">
                                <hr className="d-block lg:hidden"/>
                                <div className="top-0 top-1 border-l pl-4 py-16 sticky">
                                    <div className="edit-button">
                                        <EditDoc className="items-end btn edit-button-styles flex inline-flex items-center" />
                                    </div>
                                    {contextualLinks}
                                </div>
                            </aside>
                        </div>
                        <div className="pagination_buttons">
                          <div className={prev ? 'navigation-block flex justify-between' : 'navigation-block overflow-hidden'}>
                            {prev && (
                                <div className="prev_button">
                                <Link to={prev.url}>
                                    <span>Previous</span>
                                    <svg stroke="" fill="#78757a" strokeWidth="0"
                                         viewBox="0 0 24 24" className="css-1hyj6ne" height="1.6em" width="1.6em"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                                    </svg>
                                    <h3 className="perviousLink">
                                        {prev.title}</h3>

                                </Link>
                                </div>
                            )}
                            {next && (
                                <div className="next_button">
                                <Link to={next.url}>
                                    <span>Next</span>
                                    <svg stroke="" fill="#78757a" strokeWidth="0" viewBox="0 0 24 24"
                                         className="css-jmo9lw" height="1.6em" width="1.6em"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
                                    </svg>
                                    <h3 className="next_link">
                                        {next.title}
                                    </h3>
                                </Link>

                                </div>

                            )}
                          </div>
                          <Footer/>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};


export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        page_title
        metadesc
        canonical
        keywords
        social_share_summary
        social_share_desc
        social_share_image
        noindex
        contextual_links {
          type
          name
          url
        }
      }
      fields {
        slug
      }
    }
  }
`;
/* eslint-enaable */