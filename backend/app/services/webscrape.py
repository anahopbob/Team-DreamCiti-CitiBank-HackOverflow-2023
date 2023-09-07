from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.chrome.service import Service
import re
from selenium.webdriver.common.by import By

class WebScrape:
        
    @staticmethod
    def getWebScrape(website: str):
        driver = webdriver.Chrome()
        
        driver.get(website)

        img = driver.find_elements(By.TAG_NAME, 'img')
        img_str = ''

        for i in img:
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