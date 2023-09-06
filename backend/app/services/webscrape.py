from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.chrome.service import Service
import re
from selenium.webdriver.common.by import By

# keyword = 'Bitcoin'
# service = Service(executable_path=r'./chromedriver')
# options = webdriver.ChromeOptions()
# options.add_argument('headless')
# options.add_argument('window-size=1200x7000')
class WebScrape:
        
    @staticmethod
    def getWebScrape(website: str):
        driver = webdriver.Chrome()
        # driver = webdriver.Chrome('./chromedriver',options=options)
        # driver.get('https://www.google.com/')

        # search_query = driver.find_element(By.NAME, "q")
        # search_query.send_keys(keyword + ' wikipedia')
        # search_query.send_keys(Keys.RETURN)

        # wiki_url = driver.find_element_by_class_name('iUh30').text.replace(' › ','/')
        # wiki_url = driver.find_element(By.CLASS_NAME, 'iUh30').text.replace(' › ','/')
        driver.get(website)

        # text = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/p[2]').text
        # # text = driver.find_element_by_xpath('//*[@id="mw-content-text"]/div[1]/p[2]').text
        # if text=='':
        #     # text = driver.find_element_by_xpath('//*[@id="mw-content-text"]/div[1]/p[3]').text
        #     text = driver.find_element(By.XPATH, '//*[@id="mw-content-text"]/div[1]/p[3]').text
        # text = re.sub("[\(\[].*?[\)\]]", "", text)


        img = driver.find_elements(By.TAG_NAME, 'img')
        img_str = ''
        for i in img:
        #     img_str += f'\n{i.get_attribute("src")}\n'
            el_width= int(i.get_attribute('width'))
            el_height = int(i.get_attribute('height'))
            if min(el_width, el_height) > 50:
                img_src = i.get_attribute("src")
                img_caption = img_src.split('/')[-1].split('.')[0]
                img_str+= f'\n{img_src}\n'
                print(img_caption)

        para = driver.find_elements(By.TAG_NAME, 'p')
        final_text = ''
        for index, para in enumerate(para):
            final_text += f'\n{para.text}\n'

        return final_text 