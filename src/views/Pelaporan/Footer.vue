<template>
    <footer class="footer">
        <div class="container">
            <p class="copyright-text">Copyright &copy; TCA {{ currentYear }}. All Rights Reserved.</p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            currentYear: new Date().getFullYear()
        }
    }
}
</script>

<style scoped>
.footer {
    background-color: #f8f9fa;
    padding: 20px 0;
    text-align: center;
    border-top: 1px solid #e7e7e7;
    position: relative;
    bottom: 0;
    width: 100%;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.copyright-text {
    margin: 0;
    color: #6c757d;
    font-size: 14px;
}
</style>