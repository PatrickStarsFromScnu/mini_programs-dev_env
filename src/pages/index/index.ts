interface IndexPageData {
    name: string
}

interface IndexPage extends Page {

}

class IndexPage {
    public data: IndexPageData = {
        name: 'holyzheng'
    }
    
    public changeName(): void {
        this.setData({
            name: 'chinley'
        })
    }
}

Page(new IndexPage())
