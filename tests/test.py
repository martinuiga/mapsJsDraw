import os
from selenium import webdriver

driver = webdriver.Remote("http://localhost:4444/wd/hub", webdriver.DesiredCapabilities.FIREFOX.copy())
driver.get("file://" + os.path.abspath("index.html"))

driver.get_screenshot_as_file(os.environ['CIRCLE_ARTIFACTS'] + '/test.png')
assert "Shapefile GMaps" in driver.title

driver.find_element_by_id("map")

driver.close()